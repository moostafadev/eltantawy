import {
  OrderStatusEnum,
  PaymentMethodEnum,
} from "@/features/admin/orders/types";
import { ReturnStatusEnum } from "@/features/admin/returns/types";

export interface UserOrderRow {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  deliveryZoneTitle: string;
  total: number;
  status: OrderStatusEnum;
  paymentMethod: PaymentMethodEnum;
  createdAt: Date;
}

export interface UserReturnRow {
  id: string;
  orderId: string;
  reason: string;
  refundAmount: number;
  status: ReturnStatusEnum;
  createdAt: Date;
  order: {
    orderNumber: number;
    customerName: string;
  };
}

export interface UserSummary {
  ordersCount: number;
  totalSpent: number;
  returnsCount: number;
}
