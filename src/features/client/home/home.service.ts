"use server";

import { prisma } from "@/lib/prisma";

const MIN_TOP_SELLING_PRODUCTS = 4;

/**
 * Finds the best-selling products by summing items from delivered orders,
 * using the same sales-total ranking as the admin dashboard.
 *
 * If fewer products have sales than the requested minimum, fills the
 * remaining slots with unique products from the catalog so the home-page
 * section does not appear sparse.
 */
export const getTopSellingProducts = async (
  limit = 8,
  minimum = MIN_TOP_SELLING_PRODUCTS,
) => {
  const topItems = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        status: "DELIVERED",
      },
    },
    _sum: {
      total: true,
    },
    orderBy: {
      _sum: {
        total: "desc",
      },
    },
    take: limit,
  });

  const topIds = topItems.map((item) => item.productId);

  const productSelect = {
    id: true,
    title: true,
    image: true,
    price: true,
    discountPrice: true,
    unit: true,
    saleType: true,
    weightOptions: true,
  } as const;

  let orderedProducts: {
    id: string;
    title: string;
    image: string | null;
    price: number;
    discountPrice: number | null;
    unit: "KG" | "PIECE";
    saleType: "NORMAL" | "WEIGHT_RANGE";
    weightOptions: {
      id: string;
      name: string;
      minWeight: number;
      maxWeight: number;
      productId: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }[] = [];

  if (topIds.length > 0) {
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: topIds,
        },
      },
      select: productSelect,
    });

    const productsMap = new Map(
      products.map((product) => [product.id, product]),
    );

    // Preserve sales ranking instead of using the database result order.
    orderedProducts = topIds
      .map((id) => productsMap.get(id))
      .filter((product): product is NonNullable<typeof product> =>
        Boolean(product),
      );
  }

  /*
   * Fill the remaining slots with randomly selected products when needed.
   */
  if (orderedProducts.length < minimum) {
    const needed = minimum - orderedProducts.length;

    const excludeIds = orderedProducts.map((product) => product.id);

    const randomCandidates = await prisma.product.findMany({
      where: {
        id: {
          notIn: excludeIds,
        },
      },
      select: productSelect,
      take: 50,
    });

    const shuffled = [...randomCandidates].sort(() => Math.random() - 0.5);

    orderedProducts = [...orderedProducts, ...shuffled.slice(0, needed)];
  }

  return orderedProducts;
};
