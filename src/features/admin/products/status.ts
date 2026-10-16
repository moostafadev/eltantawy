import type { COLOR } from "@/constants/types";

export type ProductStatus = "AVAILABLE" | "HIDDEN" | "OUT_OF_STOCK";

export const productStatusLabels: Record<ProductStatus, string> = {
  AVAILABLE: "متوفر",
  HIDDEN: "مخفي",
  OUT_OF_STOCK: "غير متوفر",
};

export const productStatusColors: Record<ProductStatus, COLOR> = {
  AVAILABLE: "SUCCESS",
  HIDDEN: "NEUTRAL",
  OUT_OF_STOCK: "DANGER",
};

export const productStatusOptions = [
  { value: "AVAILABLE", label: "متوفر" },
  { value: "OUT_OF_STOCK", label: "غير متوفر" },
  { value: "HIDDEN", label: "مخفي" },
] as const;
