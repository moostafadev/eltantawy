import { COLOR } from "@/constants/types";

import { TSize } from "./types";

export const getColor = (color: COLOR) => {
  switch (color) {
    case "BLACK":
      return "bg-foreground text-background";

    case "MAIN":
      return "bg-main text-main-foreground";

    default:
      return "bg-background text-foreground";
  }
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
      return "size-9 p-0";

    case "md":
    default:
      return "px-6 py-2 text-sm";
  }
};
