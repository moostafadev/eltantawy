"use server";

import { prisma } from "@/lib/prisma";

export const getProducts = async () => {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

export const getOneProduct = async (id: string) => {
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
      categoryId: true,
      category: {
        select: {
          id: true,
          title: true,
        },
      },
      weightOptions: {
        select: {
          id: true,
          name: true,
          minWeight: true,
          maxWeight: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
};
