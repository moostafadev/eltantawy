export type DiscountTypeEnum = "COUPON" | "ALL_CUSTOMERS" | "REGISTERED_ONLY";

export type DiscountValueTypeEnum = "PERCENTAGE" | "FIXED";

export interface Discount {
  id: string;
  type: DiscountTypeEnum;
  code: string | null;
  valueType: DiscountValueTypeEnum;
  value: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const discountTypeLabels: Record<DiscountTypeEnum, string> = {
  COUPON: "كوبون خصم",
  ALL_CUSTOMERS: "خصم على كل العملاء",
  REGISTERED_ONLY: "خصم على العملاء المسجلين فقط",
};

export const discountValueTypeLabels: Record<DiscountValueTypeEnum, string> = {
  PERCENTAGE: "نسبة مئوية",
  FIXED: "مبلغ ثابت",
};
