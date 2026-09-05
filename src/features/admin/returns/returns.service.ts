"use server";

import { prisma } from "@/lib/prisma";

export const getReturns = async () => {
  return prisma.orderReturn.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      order: {
        select: {
          orderNumber: true,
          customerName: true,
        },
      },
    },
  });
};

export const getOneReturn = async (id: string) => {
  return prisma.orderReturn.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
      order: {
        select: {
          orderNumber: true,
        },
      },
    },
  });
};
