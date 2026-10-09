import type { DiscountValueType } from "@prisma/client";

export const calculateDiscountedPrice = (
  price: number,
  discountValue: number,
  discountValueType: DiscountValueType,
): number => {
  const discountAmount =
    discountValueType === "PERCENTAGE"
      ? (price * discountValue) / 100
      : discountValue;

  return Math.ceil(Math.max(0, price - discountAmount));
};
