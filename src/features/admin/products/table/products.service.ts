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
