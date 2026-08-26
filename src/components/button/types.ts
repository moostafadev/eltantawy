import { BUTTON_VARIANT, COLOR } from "@/constants/types";
import { ButtonHTMLAttributes, ReactNode } from "react";

export type TSize = "xs" | "sm" | "md" | "lg" | "icon";

export interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  color?: COLOR;
  variant?: BUTTON_VARIANT;
  size?: TSize;
  loading?: boolean;
}
