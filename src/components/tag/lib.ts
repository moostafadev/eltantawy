import { COLOR } from "@/constants/types";
import { TTagSize, TTagVariant } from "./types";

export const getColor = (color: COLOR, variant: TTagVariant) => {
  const colors: Record<COLOR, Record<TTagVariant, string>> = {
    MAIN: {
      solid: "bg-main text-main-foreground",
      soft: "bg-main/10 text-main",
      outline: "border border-main/30 text-main",
    },

    SECONDARY: {
      solid: "bg-background-second text-foreground",
      soft: "bg-background-second/40 text-foreground",
      outline: "border border-border text-foreground",
    },

    SUCCESS: {
      solid: "bg-success text-success-foreground",
      soft: "bg-success/10 text-success",
      outline: "border border-success/30 text-success",
    },

    DANGER: {
      solid: "bg-danger text-danger-foreground",
      soft: "bg-danger/10 text-danger",
      outline: "border border-danger/30 text-danger",
    },

    WARNING: {
      solid: "bg-warning text-warning-foreground",
      soft: "bg-warning/10 text-warning",
      outline: "border border-warning/30 text-warning",
    },

    INFO: {
      solid: "bg-info text-info-foreground",
      soft: "bg-info/10 text-info",
      outline: "border border-info/30 text-info",
    },

    NEUTRAL: {
      solid: "bg-foreground text-background",
      soft: "bg-muted text-foreground",
      outline: "border border-border text-foreground",
    },
  };

  return colors[color]?.[variant] ?? colors.NEUTRAL.soft;
};

export const getSize = (size: TTagSize) => {
  switch (size) {
    case "xs":
      return "px-2 py-0.5 text-[10px]";

    case "sm":
      return "px-2.5 py-1 text-xs";

    case "md":
    default:
      return "px-3 py-1.5 text-sm";
  }
};
