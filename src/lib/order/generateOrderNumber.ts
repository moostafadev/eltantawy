import { prisma } from "@/lib/prisma";

/**
 * MongoDB (عبر Prisma) مش بيدعم auto-increment زي الـ SQL databases،
 * فبنولّد رقم الطلب يدويًا: بناخد أعلى orderNumber موجود ونزوّده بواحد.
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
 * في حالة نادرة من تزامن طلبين في نفس اللحظة بالظبط، ممكن يحصل تعارض
 * على الـ unique constraint الخاص بـ orderNumber. بنعيد المحاولة بدل
 * ما نفشل الطلب بالكامل.
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
