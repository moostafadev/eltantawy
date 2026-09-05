"use server";

import { prisma } from "@/lib/prisma";

import { OrderStatusEnum } from "./types";

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

/**
 * توزيع عدد الطلبات على كل حالة، بيُستخدم في الرسم البياني الدائري
 * (Donut Chart) بالصفحة الرئيسية للداشبورد
 */
export const getOrderStatusDistribution = async (): Promise<
  { status: OrderStatusEnum; count: number }[]
> => {
  const statuses: OrderStatusEnum[] = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  const counts = await Promise.all(
    statuses.map((status) =>
      prisma.order.count({
        where: {
          status,
        },
      }),
    ),
  );

  return statuses.map((status, index) => ({
    status,
    count: counts[index],
  }));
};
