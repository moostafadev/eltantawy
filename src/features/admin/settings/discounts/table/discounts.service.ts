"use server";

import { prisma } from "@/lib/prisma";

export const getDiscounts = async () => {
  return prisma.discount.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getOneDiscount = async (id: string) => {
  return prisma.discount.findUnique({
    where: {
      id,
    },
  });
};
