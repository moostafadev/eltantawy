import { COLOR } from "@/constants/types";

export interface StatColorClasses {
  accent: string;
  iconBg: string;
  iconText: string;
  hoverBorder: string;
  hoverShadow: string;
}

/**
 * كل لون بيرجع مجموعة كلاسات ثابتة (accent bar / خلفية الأيقونة / لون
 * الأيقونة / ظل عند الـ hover) عشان نتجنب بناء class names ديناميكية
 * (Tailwind محتاج الـ class تكون literal في الكود عشان تتكتشف).
 */
export const getStatColorClasses = (color: COLOR): StatColorClasses => {
  switch (color) {
    case "SUCCESS":
      return {
        accent: "bg-success",
        iconBg: "bg-success/10",
        iconText: "text-success",
        hoverBorder: "hover:border-success/30",
        hoverShadow: "hover:shadow-success/10",
      };

    case "WARNING":
      return {
        accent: "bg-warning",
        iconBg: "bg-warning/10",
        iconText: "text-warning",
        hoverBorder: "hover:border-warning/30",
        hoverShadow: "hover:shadow-warning/10",
      };

    case "DANGER":
      return {
        accent: "bg-danger",
        iconBg: "bg-danger/10",
        iconText: "text-danger",
        hoverBorder: "hover:border-danger/30",
        hoverShadow: "hover:shadow-danger/10",
      };

    case "INFO":
      return {
        accent: "bg-info",
        iconBg: "bg-info/10",
        iconText: "text-info",
        hoverBorder: "hover:border-info/30",
        hoverShadow: "hover:shadow-info/10",
      };

    case "SECONDARY":
      return {
        accent: "bg-foreground",
        iconBg: "bg-background-second/50",
        iconText: "text-foreground",
        hoverBorder: "hover:border-border",
        hoverShadow: "hover:shadow-md",
      };

    case "MAIN":
    default:
      return {
        accent: "bg-main",
        iconBg: "bg-main/10",
        iconText: "text-main",
        hoverBorder: "hover:border-main/30",
        hoverShadow: "hover:shadow-main/10",
      };
  }
};
