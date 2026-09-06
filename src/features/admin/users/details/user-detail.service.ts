"use server";

import { prisma } from "@/lib/prisma";

export const getUserProfile = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      fName: true,
      lName: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });
};

export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: {
      userId,
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

export const getUserReturns = async (userId: string) => {
  return prisma.orderReturn.findMany({
    where: {
      order: {
        userId,
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

/**
 * ملخص الحساب: عدد الطلبات (غير الملغاة) وإجمالي المصروف الفعلي
 * (total - refundedAmount) وعدد المرتجعات
 */
export const getUserSummary = async (userId: string) => {
  const [orders, returnsCount] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId,
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
          userId,
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
