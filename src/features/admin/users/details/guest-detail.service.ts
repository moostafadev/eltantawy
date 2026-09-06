"use server";

import { prisma } from "@/lib/prisma";

export const getGuestProfile = async (phone: string) => {
  return prisma.order.findFirst({
    where: {
      userId: null,
      customerPhone: phone,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      customerName: true,
      customerPhone: true,
      customerEmail: true,
    },
  });
};

export const getGuestOrders = async (phone: string) => {
  return prisma.order.findMany({
    where: {
      userId: null,
      customerPhone: phone,
    },
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

export const getGuestReturns = async (phone: string) => {
  return prisma.orderReturn.findMany({
    where: {
      order: {
        userId: null,
        customerPhone: phone,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      orderId: true,
      reason: true,
      refundAmount: true,
      status: true,
      createdAt: true,
      order: {
        select: {
          orderNumber: true,
          customerName: true,
        },
      },
    },
  });
};

export const getGuestSummary = async (phone: string) => {
  const [orders, returnsCount] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId: null,
        customerPhone: phone,
        status: {
          not: "CANCELLED",
        },
      },
      select: {
        total: true,
        refundedAmount: true,
      },
    }),

    prisma.orderReturn.count({
      where: {
        order: {
          userId: null,
          customerPhone: phone,
        },
      },
    }),
  ]);

  return {
    ordersCount: orders.length,
    totalSpent: orders.reduce(
      (sum, order) => sum + (order.total - order.refundedAmount),
      0,
    ),
    returnsCount,
  };
};
