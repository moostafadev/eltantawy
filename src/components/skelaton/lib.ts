import { COLOR } from "@/constants/types";

export const getColor = (color: COLOR) => {
  switch (color) {
    case "BLACK":
      return "bg-foreground";
    default:
      return "bg-background";
  }
};
