export type CartUnit = "KG" | "PIECE";

export type ProductSaleType = "NORMAL" | "WEIGHT_RANGE";

export type DiscountSource = "COUPON" | "ALL_CUSTOMERS" | "REGISTERED_ONLY";

export interface CartItem {
  productId: string;

  qty: number;

  unit: CartUnit;

  /**
   * Present only for weight-range products. In this case, qty is the number
   * of packages, not the weight itself.
   */
  weightOptionId?: string;
}

export interface Cart {
  items: CartItem[];

  /**
   * Coupon code currently applied to the cart, if any. It is always stored
   * in uppercase.
   */
  couponCode?: string;
}

export interface CartWeightOption {
  id: string;

  name: string;

  minWeight: number;

  maxWeight: number;
}

export interface CartProduct {
  id: string;

  title: string;

  image: string | null;

  price: number;

  discountPrice: number | null;

  unit: CartUnit;

  saleType: ProductSaleType;
}

export interface CartItemWithProduct extends CartItem {
  product: CartProduct;

  /** Discounted price for one unit (kilogram or piece). */
  price: number;

  /** Estimated item price, using the range midpoint when the price is approximate. */
  total: number;

  /** True when the price is approximate for a weight-range product. */
  isApprox: boolean;

  /** Selected weight option details for a weight-range product. */
  weightOption?: CartWeightOption;

  /** Minimum expected price when the item price is approximate. */
  minTotal?: number;

  /** Maximum expected price when the item price is approximate. */
  maxTotal?: number;
}

export interface HydratedCart {
  items: CartItemWithProduct[];

  subtotal: number;

  /** Savings from product-level discounts (`discountPrice`). */
  discount: number;

  deliveryFee: number;

  total: number;

  /** Number of distinct products in the cart. */
  itemCount: number;

  /**
   * Sum of item quantities. For example, 2 kilograms plus 3 pieces equals 5.
   */
  quantity: number;

  /** True when at least one item has an approximate weight-range price. */
  hasApproxItems: boolean;

  /** Minimum expected cart total, including delivery and all discounts. */
  minTotal: number;

  /** Maximum expected cart total, including delivery and all discounts. */
  maxTotal: number;

  /**
   * Currently entered coupon code when valid on its own, or null. It may not
   * be the source of the applied discount if an automatic discount is larger
   * (see `appliedDiscountSource`).
   */
  couponCode: string | null;

  /** Amount saved by the entered coupon, when valid. */
  couponDiscountAmount: number;

  /** Amount saved by the best available automatic discount. */
  autoDiscountAmount: number;

  /** Description of the available automatic discount, if any. */
  autoDiscountLabel: string | null;

  /** Actual amount deducted from the total: the larger coupon or auto discount. */
  discountAmount: number;

  /** Source of the discount currently applied to the total, or null. */
  appliedDiscountSource: DiscountSource | null;

  /** Text description of the applied discount for the cart summary. */
  appliedDiscountLabel: string | null;
}
