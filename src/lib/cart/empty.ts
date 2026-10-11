import { HydratedCart } from "./types";

export const EMPTY_HYDRATED_CART: HydratedCart = {
  items: [],
  subtotal: 0,
  discount: 0,
  deliveryFee: 0,
  total: 0,
  itemCount: 0,
  quantity: 0,
  hasApproxItems: false,
  minTotal: 0,
  maxTotal: 0,
  couponCode: null,
  couponDiscountAmount: 0,
  autoDiscountAmount: 0,
  autoDiscountLabel: null,
  discountAmount: 0,
  appliedDiscountSource: null,
  appliedDiscountLabel: null,
};
