import { COLOR } from "@/constants/types";
import { TSize } from "./types";

export const getColor = (color: COLOR) => {
  switch (color) {
    case "BLACK":
      return "bg-foreground text-background";
    case "MAIN":
      return "bg-main text-background";
    default:
      return "bg-background text-foreground";
  }
};

export const getSize = (size: TSize) => {
  switch (size) {
    case "lg":
      return "px-6 text-base py-1.5";
    case "sm":
      return "px-sm text-sm";
    case "xs":
      return "px-xs text-xs";
    default:
      return "px-base text-base";
  }
};
