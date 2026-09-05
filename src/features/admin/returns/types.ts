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
 * حالات المرتجع المسموح الانتقال إليها من كل حالة:
 * - PENDING: تنتظر موافقة أو رفض الأدمن
 * - APPROVED: تمت الموافقة، بننتظر تنفيذ الاسترجاع فعليًا (تحديث الأرقام المالية)
 * - REFUNDED / REJECTED: حالات نهائية
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
