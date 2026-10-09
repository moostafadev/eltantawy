import { prisma } from "@/lib/prisma";

/**
 * MongoDB does not support auto-increment through Prisma like SQL databases,
 * so this generates an order number by incrementing the highest existing one.
 */
const START_ORDER_NUMBER = 1000;

export const generateOrderNumber = async (): Promise<number> => {
  const lastOrder = await prisma.order.findFirst({
    orderBy: {
      orderNumber: "desc",
    },
    select: {
      orderNumber: true,
    },
  });

  return (lastOrder?.orderNumber ?? START_ORDER_NUMBER) + 1;
};

/**
 * Concurrent requests can occasionally collide on the unique orderNumber
 * constraint. Retry those conflicts instead of failing the entire request.
 */
export const withOrderNumberRetry = async <T>(
  fn: (orderNumber: number) => Promise<T>,
  maxAttempts = 3,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const orderNumber = await generateOrderNumber();

    try {
      return await fn(orderNumber);
    } catch (error) {
      lastError = error;

      const isUniqueConflict =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002";

      if (!isUniqueConflict) {
        throw error;
      }
    }
  }

  throw lastError;
};
