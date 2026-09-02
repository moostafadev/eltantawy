import { BUTTON_VARIANT, COLOR } from "@/constants/types";
import { TSize } from "./types";

type ColorVariant = Exclude<BUTTON_VARIANT, "card">;

export const getColor = (
  color: COLOR = "NEUTRAL",
  variant: ColorVariant = "solid",
) => {
  const colors: Record<COLOR, Record<ColorVariant, string>> = {
    MAIN: {
      solid: "bg-main text-main-foreground hover:bg-main/90",
      soft: "bg-main/10 text-main hover:bg-main/15",
      outline: "border border-main/50 text-main hover:bg-main/10",
      ghost: "text-main hover:bg-main/10",
    },

    SECONDARY: {
      solid:
        "bg-background-second text-foreground hover:bg-background-second/80",
      soft: "bg-background-second/40 text-foreground hover:bg-background-second/60",
      outline: "border border-border/50 text-foreground hover:bg-muted",
      ghost: "text-foreground hover:bg-muted",
    },

    SUCCESS: {
      solid: "bg-success text-success-foreground hover:bg-success/90",
      soft: "bg-success/10 text-success hover:bg-success/15",
      outline: "border border-success/50 text-success hover:bg-success/10",
      ghost: "text-success hover:bg-success/10",
    },

    DANGER: {
      solid: "bg-danger text-danger-foreground hover:bg-danger/90",
      soft: "bg-danger/10 text-danger hover:bg-danger/15",
      outline: "border border-danger/50 text-danger hover:bg-danger/10",
      ghost: "text-danger hover:bg-danger/10",
    },

    WARNING: {
      solid: "bg-warning text-warning-foreground hover:bg-warning/90",
      soft: "bg-warning/10 text-warning hover:bg-warning/15",
      outline: "border border-warning/50 text-warning hover:bg-warning/10",
      ghost: "text-warning hover:bg-warning/10",
    },

    INFO: {
      solid: "bg-info text-info-foreground hover:bg-info/90",
      soft: "bg-info/10 text-info hover:bg-info/15",
      outline: "border border-info/50 text-info hover:bg-info/10",
      ghost: "text-info hover:bg-info/10",
    },

    NEUTRAL: {
      solid: "bg-foreground text-background hover:bg-foreground/90",
      soft: "bg-muted text-foreground hover:bg-muted/80",
      outline: "border border-border/50 text-foreground hover:bg-muted",
      ghost: "text-foreground hover:bg-muted",
    },
  };

  return colors[color]?.[variant] ?? colors.NEUTRAL.solid;
};

export const getCardStyles = (selected: boolean) => {
  return selected
    ? "border-main bg-main/5 shadow-sm text-main"
    : "border-border bg-background text-foreground hover:border-main/40 hover:bg-main/5";
};

export const getSize = (size: TSize) => {
  switch (size) {
    case "xs":
      return "px-3 py-1.5 text-xs";

    case "sm":
      return "px-4 py-1.5 text-sm";

    case "lg":
      return "px-8 py-2.5 text-base";

    case "icon":
      return "p-1.5";

    case "md":
    default:
      return "px-6 py-2 text-sm";
  }
};
