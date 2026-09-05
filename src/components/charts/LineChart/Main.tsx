"use client";

import { useId, useState } from "react";

import { toArabicNums } from "@/utils/toArabicNums";

import { getChartColor } from "../shared/colors";
import { ChartEmptyState } from "../shared/ChartEmptyState";
import { LineChartProps } from "./types";

const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 200;
const PADDING = 10;

/**
 * رسم بياني خطي (Line Chart) بـ SVG خالص بدون أي مكتبة، بيدعم تعبئة
 * المنطقة تحت الخط (area) بشكل اختياري، مع hover لعرض قيمة كل نقطة.
 *
 * ملاحظة RTL: أول نقطة في البيانات بتترسم في أقصى اليمين (مش الشمال)
 * عشان يتماشى مع اتجاه قراءة الموقع.
 *
 * @example
 * <LineChart data={monthlySales} color="MAIN" area suffix=" ج.م" />
 */
const LineChart = ({
  data,
  color = "MAIN",
  height = 220,
  area = true,
  suffix = "",
}: LineChartProps) => {
  const gradientId = useId();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return <ChartEmptyState />;
  }

  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const minValue = Math.min(...data.map((point) => point.value), 0);
  const range = maxValue - minValue || 1;

  const stepX =
    data.length > 1 ? (VIEW_WIDTH - PADDING * 2) / (data.length - 1) : 0;

  /*
   * x بتتحسب من اليمين للشمال (RTL): أول نقطة (index = 0) بتترسم في
   * أقصى اليمين، وآخر نقطة في أقصى الشمال
   */
  const points = data.map((point, index) => {
    const x = VIEW_WIDTH - PADDING - stepX * index;

    const y =
      VIEW_HEIGHT -
      PADDING -
      ((point.value - minValue) / range) * (VIEW_HEIGHT - PADDING * 2);

    return { x, y, ...point };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];

  const areaPath = `${linePath} L ${lastPoint.x} ${VIEW_HEIGHT - PADDING} L ${firstPoint.x} ${VIEW_HEIGHT - PADDING} Z`;

  const strokeColor = getChartColor(color);

  const formatValue = (value: number) =>
    `${toArabicNums(Math.round(value))}${suffix}`;

  return (
    <div className="flex flex-col gap-2" style={{ height }}>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="none"
        className="w-full flex-1"
      >
        {area && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}

        {area && <path d={areaPath} fill={`url(#${gradientId})`} />}

        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={point.label}>
            <rect
              x={point.x - stepX / 2}
              y={0}
              width={stepX || VIEW_WIDTH}
              height={VIEW_HEIGHT}
              fill="transparent"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            />

            <circle
              cx={point.x}
              cy={point.y}
              r={activeIndex === index ? 6 : 4}
              fill={strokeColor}
              stroke="var(--color-background)"
              strokeWidth={2}
              className="pointer-events-none transition-all duration-200"
            />
          </g>
        ))}
      </svg>

      <div dir="rtl" className="flex justify-between gap-1">
        {data.map((point, index) => (
          <span
            key={point.label}
            className={`min-w-0 flex-1 truncate text-center text-[10px] transition-colors sm:text-xs ${
              activeIndex === index
                ? "font-bold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {point.label}
          </span>
        ))}
      </div>

      <div
        className="min-h-4 text-center text-xs font-bold transition-opacity"
        style={{
          color: strokeColor,
          opacity: activeIndex !== null ? 1 : 0,
        }}
      >
        {activeIndex !== null ? formatValue(points[activeIndex].value) : "—"}
      </div>
    </div>
  );
};

export default LineChart;
