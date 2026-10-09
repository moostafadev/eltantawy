import { MonthlySales, MonthlySalesRow } from "./types";

/**
 * Converts monthly sales data into rows with the percentage change from the
 * previous month, for use in monthly cards and the detailed table.
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
