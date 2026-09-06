"use server";

import { prisma } from "@/lib/prisma";

const MIN_TOP_SELLING_PRODUCTS = 4;

/**
 * الأكثر مبيعًا فعليًا: بنجمع كل عناصر الطلبات اللي حالتها "تم التوصيل"
 * لكل منتج، ونرتب حسب إجمالي المبيعات (نفس منطق getTopProducts في الأدمن).
 *
 * لو عدد المنتجات الحقيقية اللي اتباعت أقل من الحد الأدنى المطلوب،
 * بنكمل الباقي بمنتجات عشوائية من الكتالوج (مع استبعاد المكرر) عشان
 * القسم في الصفحة الرئيسية ميفضلش شبه فاضي
 */
export const getTopSellingProducts = async (
  limit = 8,
  minimum = MIN_TOP_SELLING_PRODUCTS,
) => {
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        status: "DELIVERED",
      },
    },
    select: {
      productId: true,
      qty: true,
      total: true,
    },
  });

  const totalsMap = new Map<string, { qty: number; total: number }>();

  for (const item of items) {
    const existing = totalsMap.get(item.productId);

    if (existing) {
      existing.qty += item.qty;
      existing.total += item.total;
    } else {
      totalsMap.set(item.productId, { qty: item.qty, total: item.total });
    }
  }

  const topIds = Array.from(totalsMap.entries())
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, limit)
    .map(([productId]) => productId);

  const productSelect = {
    id: true,
    title: true,
    image: true,
    price: true,
    discountPrice: true,
    unit: true,
    saleType: true,
    weightOptions: true,
  } as const;

  let orderedProducts: {
    id: string;
    title: string;
    image: string | null;
    price: number;
    discountPrice: number | null;
    unit: "KG" | "PIECE";
    saleType: "NORMAL" | "WEIGHT_RANGE";
    weightOptions: {
      id: string;
      name: string;
      minWeight: number;
      maxWeight: number;
      productId: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }[] = [];

  if (topIds.length > 0) {
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: topIds,
        },
      },
      select: productSelect,
    });

    const productsMap = new Map(
      products.map((product) => [product.id, product]),
    );

    // بنحافظ على ترتيب الأكثر مبيعًا (حسب الإجمالي) مش ترتيب الداتابيز
    orderedProducts = topIds
      .map((id) => productsMap.get(id))
      .filter((product): product is NonNullable<typeof product> =>
        Boolean(product),
      );
  }

  /*
   * تكملة عشوائية لو العدد أقل من الحد الأدنى المطلوب
   */
  if (orderedProducts.length < minimum) {
    const needed = minimum - orderedProducts.length;

    const excludeIds = orderedProducts.map((product) => product.id);

    const randomCandidates = await prisma.product.findMany({
      where: {
        id: {
          notIn: excludeIds,
        },
      },
      select: productSelect,
      take: 50,
    });

    const shuffled = [...randomCandidates].sort(() => Math.random() - 0.5);

    orderedProducts = [...orderedProducts, ...shuffled.slice(0, needed)];
  }

  return orderedProducts;
};
