"use server";

import { cache } from "react";

import { prisma } from "@/lib/prisma";

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
 * Returns related products from the same category for the product details
 * page, improving navigation and supporting SEO engagement signals.
 */
export const getRelatedProducts = async (
  categoryId: string | null,
  excludeId: string,
  limit = 4,
) => {
  if (!categoryId) {
    return [];
  }

  return prisma.product.findMany({
    where: {
      categoryId,
      NOT: {
        id: excludeId,
      },
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      image: true,
      price: true,
      discountPrice: true,
      unit: true,
      saleType: true,
      weightOptions: true,
    },
  });
};
