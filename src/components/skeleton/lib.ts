import { COLOR } from "@/constants/types";

export const getColor = (color: COLOR) => {
  switch (color) {
    case "MAIN":
      return "bg-main/10";

    case "SECONDARY":
      return "bg-background-second/40";

    case "SUCCESS":
      return "bg-success/10";

    case "DANGER":
      return "bg-danger/10";

    case "WARNING":
      return "bg-warning/10";

    case "INFO":
      return "bg-info/10";

    case "NEUTRAL":
      return "bg-muted";

    default:
      return "bg-muted";
  }
};
