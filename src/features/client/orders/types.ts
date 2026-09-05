export type ClientOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderStatusHistoryItem {
  id: string;
  status: ClientOrderStatus;
  createdAt: Date;
}

export interface OrderListItem {
  id: string;
  orderNumber: number;
  status: ClientOrderStatus;
  total: number;
  itemsCount: number;
  createdAt: Date;
}

export interface OrderDetailItem {
  id: string;
  title: string;
  image: string | null;
  unit: "KG" | "PIECE";
  price: number;
  qty: number;
  weightOptionName: string | null;
  isApprox: boolean;
  minTotal: number | null;
  maxTotal: number | null;
  total: number;
  returnedQty: number;
}

export interface OrderDetail {
  id: string;
  orderNumber: number;
  status: ClientOrderStatus;
  items: OrderDetailItem[];
  deliveryZoneTitle: string;
  deliveryFee: number;
  addressLine: string;
  notes: string | null;
  subtotal: number;
  productsDiscount: number;
  couponCode: string | null;
  discountAmount: number;
  total: number;
  refundedAmount: number;
  createdAt: Date;
  statusHistory: OrderStatusHistoryItem[];
}

export const clientOrderStatusLabels: Record<ClientOrderStatus, string> = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "تم التأكيد",
  PREPARING: "قيد التجهيز",
  OUT_FOR_DELIVERY: "خرج للتوصيل",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
};

export const clientOrderStatusColors: Record<
  ClientOrderStatus,
  "WARNING" | "INFO" | "MAIN" | "SUCCESS" | "DANGER"
> = {
  PENDING: "WARNING",
  CONFIRMED: "INFO",
  PREPARING: "MAIN",
  OUT_FOR_DELIVERY: "MAIN",
  DELIVERED: "SUCCESS",
  CANCELLED: "DANGER",
};
