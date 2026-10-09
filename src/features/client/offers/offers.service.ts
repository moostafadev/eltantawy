"use server";

import { prisma } from "@/lib/prisma";

/**
 * Returns products with an active direct discount (`discountPrice` below
 * `price`), sorted by the largest percentage discount first.
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
 * Returns the first currently valid automatic discount for all customers
 * or registered customers, for the banner at the top of the offers page.
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

  // Prefer the discount with the greatest relative value.
  return validDiscounts.sort((a, b) => b.value - a.value)[0];
};
