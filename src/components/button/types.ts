import { COLOR } from "@/constants/types";
import { ButtonHTMLAttributes, ReactNode } from "react";

export type TSize = "xs" | "sm" | "md" | "lg";

export interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  color?: COLOR;
  size?: TSize;
  loading?: boolean;
}
