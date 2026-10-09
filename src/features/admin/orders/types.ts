export type OrderStatusEnum =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethodEnum = "CASH_ON_DELIVERY";

export type DiscountSourceEnum = "COUPON" | "ALL_CUSTOMERS" | "REGISTERED_ONLY";

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  image: string | null;
  unit: "KG" | "PIECE";
  price: number;
  qty: number;
  weightOptionId: string | null;
  weightOptionName: string | null;
  isApprox: boolean;
  minWeight: number | null;
  maxWeight: number | null;
  minTotal: number | null;
  maxTotal: number | null;
  actualWeight: number | null;
  weightConfirmed: boolean;
  total: number;
  returnedQty: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  userId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  items: OrderItem[];
  deliveryZoneId: string | null;
  deliveryZoneTitle: string;
  deliveryFee: number;
  addressLine: string;
  notes: string | null;
  subtotal: number;
  productsDiscount: number;
  couponCode: string | null;
  discountAmount: number;
  appliedDiscountSource: DiscountSourceEnum | null;
  total: number;
  refundedAmount: number;
  paymentMethod: PaymentMethodEnum;
  status: OrderStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export const orderStatusLabels: Record<OrderStatusEnum, string> = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "تم التأكيد",
  PREPARING: "قيد التجهيز",
  OUT_FOR_DELIVERY: "خرج للتوصيل",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
};

export const orderStatusColors: Record<
  OrderStatusEnum,
  "WARNING" | "INFO" | "MAIN" | "SUCCESS" | "DANGER"
> = {
  PENDING: "WARNING",
  CONFIRMED: "INFO",
  PREPARING: "MAIN",
  OUT_FOR_DELIVERY: "MAIN",
  DELIVERED: "SUCCESS",
  CANCELLED: "DANGER",
};

export const paymentMethodLabels: Record<PaymentMethodEnum, string> = {
  CASH_ON_DELIVERY: "الدفع عند الاستلام",
};

/**
 * Allowed order status transitions, used by the admin UI to prevent
 * invalid changes (for example, moving from DELIVERED back to PENDING).
 */
export const orderStatusTransitions: Record<
  OrderStatusEnum,
  OrderStatusEnum[]
> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

/**
 * The status that requires every weight-range item in the order to have a
 * confirmed actual weight (`weightConfirmed = true`).
 */
export const WEIGHT_CONFIRMATION_REQUIRED_BEFORE: OrderStatusEnum =
  "OUT_FOR_DELIVERY";
