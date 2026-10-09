import type { ReactNode } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left" | "auto";

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: TooltipSide;
  className?: string;
  focusable?: boolean;
}
