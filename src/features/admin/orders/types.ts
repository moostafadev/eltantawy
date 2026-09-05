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
  minTotal: number | null;
  maxTotal: number | null;
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
 * حالات الطلب المسموح الانتقال إليها من كل حالة، بيستخدم في الأدمن
 * لمنع تغيير حالة الطلب بشكل غير منطقي (مثال: من DELIVERED لـ PENDING)
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
