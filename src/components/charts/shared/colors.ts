import { COLOR } from "@/constants/types";

/**
 * تحويل قيمة الـ COLOR الموحّدة بالمشروع إلى قيمة CSS var فعلية،
 * يُستخدم داخل عناصر SVG (fill/stroke) اللي محتاجة قيمة لون مباشرة.
 */
export const getChartColor = (color: COLOR = "MAIN"): string => {
  const colors: Record<COLOR, string> = {
    MAIN: "var(--color-main)",
    SECONDARY: "var(--color-background-second)",
    SUCCESS: "var(--color-success)",
    DANGER: "var(--color-danger)",
    WARNING: "var(--color-warning)",
    INFO: "var(--color-info)",
    NEUTRAL: "var(--color-foreground)",
  };

  return colors[color] ?? colors.MAIN;
};

/**
 * نفس فكرة `getStatColorClasses` بالداشبورد، لكن مخصصة لأيقونة
 * الهيدر داخل `ChartCard` بدون اعتماد المكوّن على مجلد features/.
 */
export const getIconColorClasses = (color: COLOR = "MAIN") => {
  const classes: Record<COLOR, { bg: string; text: string }> = {
    MAIN: { bg: "bg-main/10", text: "text-main" },
    SECONDARY: { bg: "bg-background-second/50", text: "text-foreground" },
    SUCCESS: { bg: "bg-success/10", text: "text-success" },
    DANGER: { bg: "bg-danger/10", text: "text-danger" },
    WARNING: { bg: "bg-warning/10", text: "text-warning" },
    INFO: { bg: "bg-info/10", text: "text-info" },
    NEUTRAL: { bg: "bg-muted", text: "text-foreground" },
  };

  return classes[color] ?? classes.MAIN;
};
