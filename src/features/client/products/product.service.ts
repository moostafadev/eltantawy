"use server";

import { cache } from "react";

import { prisma } from "@/lib/prisma";

const productCardSelect = {
  id: true,
  title: true,
  image: true,
  price: true,
  discountPrice: true,
  unit: true,
  saleType: true,
  status: true,
  weightOptions: true,
} as const;

type ProductCard = {
  id: string;
  title: string;
  image: string | null;
  price: number;
  discountPrice: number | null;
  unit: "KG" | "PIECE";
  saleType: "NORMAL" | "WEIGHT_RANGE";
  status: "AVAILABLE" | "HIDDEN" | "OUT_OF_STOCK";
  weightOptions: {
    id: string;
    name: string;
    minWeight: number;
    maxWeight: number;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

/**
 * A product is sellable when its status is neither HIDDEN nor OUT_OF_STOCK.
 * A missing `status` field (legacy data) is treated as sellable, because
 * Prisma + MongoDB does not backfill defaults on legacy documents.
 */
const isSellable = (product: { status?: string | null }): boolean =>
  product.status !== "HIDDEN" && product.status !== "OUT_OF_STOCK";

const getCachedProductForStore = cache(async (id: string) => {
  return prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      desc: true,
      image: true,
      price: true,
      discountPrice: true,
      unit: true,
      saleType: true,
      status: true,
      weightOptions: {
        select: {
          id: true,
          name: true,
          minWeight: true,
          maxWeight: true,
        },
      },
      categoryId: true,
      category: {
        select: {
          id: true,
          title: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
});

export const getProductForStore = async (id: string) =>
  getCachedProductForStore(id);

/**
 * Fetches up to `needed` sellable products from a specific category,
 * excluding the given IDs. Filtering by `status` is done in JS so legacy
 * products without a `status` field are still included.
 */
const fetchProductsForCategory = async (
  categoryId: string,
  excludeIds: string[],
  needed: number,
): Promise<ProductCard[]> => {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      ...(excludeIds.length > 0 ? { NOT: { id: { in: excludeIds } } } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    // Grab extra so we can drop non-sellable ones and still have enough.
    take: needed * 3,
    select: productCardSelect,
  });

  return products.filter(isSellable).slice(0, needed);
};

/**
 * Returns related products for the product details page.
 *
 * Priority order:
 *   1. Products from the exact same category (excluding the current one).
 *   2. Products from the parent category, walking up the tree.
 *   3. Nothing further — showing fewer than `limit` is acceptable.
 *
 * HIDDEN and OUT_OF_STOCK products are always excluded.
 */
export const getRelatedProducts = async (
  categoryId: string | null,
  excludeId: string,
  limit = 4,
): Promise<ProductCard[]> => {
  if (!categoryId) {
    return [];
  }

  const excluded = new Set<string>([excludeId]);
  const collected: ProductCard[] = [];

  let currentCategoryId: string | null = categoryId;

  while (currentCategoryId !== null && collected.length < limit) {
    const searchCategoryId: string = currentCategoryId;
    const remaining = limit - collected.length;

    const products = await fetchProductsForCategory(
      searchCategoryId,
      Array.from(excluded),
      remaining,
    );

    for (const product of products) {
      if (!excluded.has(product.id)) {
        excluded.add(product.id);
        collected.push(product);
      }
    }

    if (collected.length >= limit) {
      break;
    }

    const parent: { parentId: string | null } | null =
      await prisma.category.findUnique({
        where: { id: searchCategoryId },
        select: { parentId: true },
      });

    currentCategoryId = parent?.parentId ?? null;
  }

  return collected;
};
