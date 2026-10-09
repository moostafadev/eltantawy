"use server";

import { prisma } from "@/lib/prisma";

/** Returns the user's latest orders for the profile-page summary. */
export const getRecentOrdersForUser = async (userId: string, limit = 3) => {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
      items: {
        select: {
          id: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    itemsCount: order.items.length,
    createdAt: order.createdAt,
  }));
};

/**
 * Returns all user orders with their items and timestamped status history
 * for the `/profile/orders` page.
 */
export const getAllOrdersForUser = async (userId: string) => {
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
      status: true,
      deliveryZoneTitle: true,
      deliveryFee: true,
      addressLine: true,
      notes: true,
      subtotal: true,
      productsDiscount: true,
      couponCode: true,
      discountAmount: true,
      total: true,
      refundedAmount: true,
      createdAt: true,

      items: {
        select: {
          id: true,
          title: true,
          image: true,
          unit: true,
          price: true,
          qty: true,
          weightOptionName: true,
          isApprox: true,
          minTotal: true,
          maxTotal: true,
          actualWeight: true,
          weightConfirmed: true,
          total: true,
          returnedQty: true,
        },
      },

      statusHistory: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });
};

/**
 * Returns one order and its timestamped status history, restricted to its
 * owner (`userId`) so users cannot view another customer's order by ID.
 */
export const getOneOrderForUser = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      deliveryZoneTitle: true,
      deliveryFee: true,
      addressLine: true,
      notes: true,
      subtotal: true,
      productsDiscount: true,
      couponCode: true,
      discountAmount: true,
      total: true,
      refundedAmount: true,
      createdAt: true,

      items: {
        select: {
          id: true,
          title: true,
          image: true,
          unit: true,
          price: true,
          qty: true,
          weightOptionName: true,
          isApprox: true,
          minTotal: true,
          maxTotal: true,
          actualWeight: true,
          weightConfirmed: true,
          total: true,
          returnedQty: true,
        },
      },

      statusHistory: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  return order;
};
