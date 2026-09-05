"use server";

import { prisma } from "@/lib/prisma";

export const getOrders = async () => {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      customerPhone: true,
      deliveryZoneTitle: true,
      total: true,
      status: true,
      paymentMethod: true,
      createdAt: true,
    },
  });
};

export const getOneOrder = async (id: string) => {
  return prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
      returns: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};
