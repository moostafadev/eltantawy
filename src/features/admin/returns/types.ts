export type ReturnStatusEnum = "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";

export interface OrderReturnItem {
  id: string;
  orderItemId: string;
  qty: number;
  amount: number;
}

export interface OrderReturn {
  id: string;
  orderId: string;
  items: OrderReturnItem[];
  reason: string;
  refundAmount: number;
  status: ReturnStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export const returnStatusLabels: Record<ReturnStatusEnum, string> = {
  PENDING: "قيد المراجعة",
  APPROVED: "تمت الموافقة",
  REJECTED: "مرفوض",
  REFUNDED: "تم الاسترجاع",
};

export const returnStatusColors: Record<
  ReturnStatusEnum,
  "WARNING" | "SUCCESS" | "DANGER" | "INFO"
> = {
  PENDING: "WARNING",
  APPROVED: "INFO",
  REJECTED: "DANGER",
  REFUNDED: "SUCCESS",
};

/**
 * Allowed return status transitions:
 * - PENDING: awaiting admin approval or rejection.
 * - APPROVED: approved and awaiting the refund operation and financial updates.
 * - REFUNDED / REJECTED: terminal states.
 */
export const returnStatusTransitions: Record<
  ReturnStatusEnum,
  ReturnStatusEnum[]
> = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["REFUNDED"],
  REJECTED: [],
  REFUNDED: [],
};
