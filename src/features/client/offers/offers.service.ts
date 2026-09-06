"use server";

import { prisma } from "@/lib/prisma";

/**
 * المنتجات اللي عليها خصم مباشر فعليًا (discountPrice أقل من price)،
 * بترتيب حسب نسبة الخصم الأعلى أولًا
 */
export const getDiscountedProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      discountPrice: {
        not: null,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      image: true,
      price: true,
      discountPrice: true,
      unit: true,
      saleType: true,
      weightOptions: true,
    },
  });

  return products
    .filter(
      (product): product is typeof product & { discountPrice: number } =>
        product.discountPrice !== null && product.discountPrice < product.price,
    )
    .sort((a, b) => {
      const discountA = (a.price - a.discountPrice) / a.price;
      const discountB = (b.price - b.discountPrice) / b.price;

      return discountB - discountA;
    });
};

/**
 * أول خصم تلقائي مفعّل حاليًا وصالح (كل العملاء أو المسجلين فقط)،
 * بيُعرض كبانر أعلى صفحة العروض
 */
export const getActiveAutoDiscount = async () => {
  const now = new Date();

  const discounts = await prisma.discount.findMany({
    where: {
      type: {
        in: ["ALL_CUSTOMERS", "REGISTERED_ONLY"],
      },
      isActive: true,
    },
  });

  const validDiscounts = discounts.filter((discount) => {
    if (discount.startDate && now < discount.startDate) return false;
    if (discount.endDate && now > discount.endDate) return false;
    if (
      discount.usageLimit !== null &&
      discount.usageCount >= discount.usageLimit
    ) {
      return false;
    }

    return true;
  });

  if (validDiscounts.length === 0) {
    return null;
  }

  // نفضّل الخصم الأعلى قيمة نسبية لو فيه أكتر من واحد
  return validDiscounts.sort((a, b) => b.value - a.value)[0];
};
