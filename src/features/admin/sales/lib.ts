import { MonthlySales, MonthlySalesRow } from "./types";

/**
 * بيحول قائمة المبيعات الشهرية الخام إلى صفوف تحتوي على نسبة التغيير
 * عن الشهر السابق مباشرة، بيُستخدم في بطاقات الأشهر والجدول التفصيلي
 */
export const buildMonthlyRows = (data: MonthlySales[]): MonthlySalesRow[] => {
  return data.map((month, index) => {
    const previous = data[index - 1];

    const change =
      index === 0 || !previous || previous.value === 0
        ? null
        : ((month.value - previous.value) / previous.value) * 100;

    return {
      ...month,
      change,
    };
  });
};
