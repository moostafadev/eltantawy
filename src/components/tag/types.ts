import { COLOR } from "@/constants/types";
import { ReactNode } from "react";

export type TTagSize = "xs" | "sm" | "md";

export type TTagVariant = "solid" | "soft" | "outline";

export interface TagProps {
  children: ReactNode;
  color?: COLOR;
  variant?: TTagVariant;
  size?: TTagSize;
  className?: string;
}
