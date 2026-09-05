"use client";

import { useState } from "react";

import { toArabicNums } from "@/utils/toArabicNums";

import { getChartColor } from "../shared/colors";
import { ChartEmptyState } from "../shared/ChartEmptyState";
import { BarChartProps } from "./types";

/**
 * رسم بياني عمودي (Bar Chart) قابل لإعادة الاستخدام لأي مجموعة بيانات
 * بسيطة من نوع `{ label, value }`. بيدعم hover tooltip بسيط لكل عمود.
 *
 * ملاحظة RTL: العناصر بتترتب `dir="rtl"` صراحةً عشان أول عنصر في
 * البيانات يظهر في أقصى اليمين بشكل ثابت بغض النظر عن اتجاه الصفحة.
 *
 * @example
 * <BarChart data={monthlySales} color="SUCCESS" height={180} suffix=" ج.م" />
 */
const BarChart = ({
  data,
  color = "MAIN",
  height = 160,
  suffix = "",
}: BarChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return <ChartEmptyState />;
  }

  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const barColor = getChartColor(color);

  const formatValue = (value: number) =>
    `${toArabicNums(Math.round(value))}${suffix}`;

  return (
    <div
      dir="rtl"
      className="flex items-end justify-between gap-2 lg:gap-3"
      style={{ height }}
    >
      {data.map((point, index) => {
        const heightPercent = Math.max((point.value / maxValue) * 100, 2);
        const isActive = activeIndex === index;

        return (
          <div
            key={point.label}
            className="relative flex h-full min-w-0 flex-1 flex-col items-center gap-2"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className={`pointer-events-none absolute -top-7 z-10 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-bold text-white shadow-md transition-opacity duration-150 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundColor: barColor }}
            >
              {formatValue(point.value)}
            </div>

            <div className="flex w-full flex-1 items-end overflow-hidden rounded-t-sm bg-muted/40">
              <div
                className="w-full rounded-t-sm transition-all duration-500"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: barColor,
                  opacity: isActive ? 1 : 0.85,
                }}
              />
            </div>

            <span className="max-w-full truncate text-[10px] text-muted-foreground sm:text-xs">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;
