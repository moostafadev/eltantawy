"use server";

import { prisma } from "@/lib/prisma";

import { MonthlySales, SalesSummary, TopProduct } from "./types";

const MONTHS_TO_SHOW = 6;
const TOP_PRODUCTS_LIMIT = 5;

/**
 * ملخص الأداء المالي: المبيعات = إجمالي (total - refundedAmount) لكل
 * الطلبات اللي حالتها "تم التوصيل" فقط، بحيث تكون المرتجعات مخصومة
 * تلقائيًا من صافي المبيعات
 */
export const getSalesSummary = async (): Promise<SalesSummary> => {
  const [deliveredOrders, refundedAmountAgg, returnsCounts] = await Promise.all(
    [
      prisma.order.findMany({
        where: {
          status: "DELIVERED",
        },
        select: {
          total: true,
          refundedAmount: true,
        },
      }),

      prisma.order.aggregate({
        _sum: {
          refundedAmount: true,
        },
      }),

      Promise.all([
        prisma.orderReturn.count(),
        prisma.orderReturn.count({ where: { status: "PENDING" } }),
        prisma.orderReturn.count({ where: { status: "APPROVED" } }),
        prisma.orderReturn.count({ where: { status: "REFUNDED" } }),
        prisma.orderReturn.count({ where: { status: "REJECTED" } }),
      ]),
    ],
  );

  const totalSales = deliveredOrders.reduce(
    (sum, order) => sum + (order.total - order.refundedAmount),
    0,
  );

  const deliveredOrdersCount = deliveredOrders.length;

  const averageOrderValue =
    deliveredOrdersCount > 0 ? totalSales / deliveredOrdersCount : 0;

  const [
    returnsRequestsCount,
    pendingReturnsCount,
    approvedReturnsCount,
    refundedReturnsCount,
    rejectedReturnsCount,
  ] = returnsCounts;

  return {
    totalSales,
    deliveredOrdersCount,
    averageOrderValue,
    totalReturnsAmount: refundedAmountAgg._sum.refundedAmount ?? 0,
    returnsRequestsCount,
    pendingReturnsCount,
    approvedReturnsCount,
    refundedReturnsCount,
    rejectedReturnsCount,
  };
};

/**
 * صافي المبيعات مجمّعة شهريًا لآخر 6 أشهر، بيُستخدم في الرسم البياني
 */
export const getMonthlySales = async (): Promise<MonthlySales[]> => {
  const deliveredOrders = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
    },
    select: {
      total: true,
      refundedAmount: true,
      createdAt: true,
    },
  });

  const now = new Date();

  const months: { key: string; label: string; value: number }[] = [];

  for (let i = MONTHS_TO_SHOW - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const label = date.toLocaleDateString("ar-EG", {
      month: "short",
      year: "2-digit",
    });

    months.push({ key, label, value: 0 });
  }

  const monthsMap = new Map(months.map((month) => [month.key, month]));

  for (const order of deliveredOrders) {
    const createdAt = new Date(order.createdAt);

    const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;

    const month = monthsMap.get(key);

    if (month) {
      month.value += order.total - order.refundedAmount;
    }
  }

  return months.map(({ label, value }) => ({ label, value }));
};

/**
 * الأكثر مبيعًا من المنتجات، بناءً على الطلبات المكتملة فقط
 */
export const getTopProducts = async (): Promise<TopProduct[]> => {
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        status: "DELIVERED",
      },
    },
    select: {
      productId: true,
      title: true,
      qty: true,
      total: true,
    },
  });

  const productsMap = new Map<string, TopProduct>();

  for (const item of items) {
    const existing = productsMap.get(item.productId);

    if (existing) {
      existing.qty += item.qty;
      existing.total += item.total;
    } else {
      productsMap.set(item.productId, {
        productId: item.productId,
        title: item.title,
        qty: item.qty,
        total: item.total,
      });
    }
  }

  return Array.from(productsMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, TOP_PRODUCTS_LIMIT);
};
