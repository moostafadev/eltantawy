"use client";

import { useState } from "react";

import { toArabicNums } from "@/utils/toArabicNums";

import { getChartColor } from "../shared/colors";
import { ChartEmptyState } from "../shared/ChartEmptyState";
import { DonutChartProps } from "./types";

const SIZE = 160;
const STROKE_WIDTH = 22;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Segment {
  label: string;
  value: number;
  dashArray: string;
  dashOffset: number;
  strokeColor: string;
  index: number;
}

/**
 * رسم بياني دائري (Donut Chart) لعرض توزيع نسبي بين عدة فئات، كل فئة
 * ليها لونها الخاص (`COLOR`)، مع legend تفاعلي بجانبه.
 *
 * @example
 * <DonutChart
 *   data={[
 *     { label: "تم التوصيل", value: 40, color: "SUCCESS" },
 *     { label: "قيد الانتظار", value: 10, color: "WARNING" },
 *   ]}
 * />
 */
const DonutChart = ({ data, size = SIZE, suffix = "" }: DonutChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0 || total === 0) {
    return <ChartEmptyState />;
  }

  const formatValue = (value: number) =>
    `${toArabicNums(Math.round(value))}${suffix}`;

  /*
   * بنحسب الـ segments بدون أي reassignment لمتغير خارجي أثناء الرندر
   * (استخدام reduce مع accumulator بدل mutation مباشر لمتغير عادي)
   */
  const { list: segments } = data.reduce<{
    list: Segment[];
    cumulative: number;
  }>(
    (acc, item, index) => {
      const percent = item.value / total;

      const dashArray = `${percent * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
      const dashOffset = -acc.cumulative * CIRCUMFERENCE;

      return {
        list: [
          ...acc.list,
          {
            label: item.label,
            value: item.value,
            dashArray,
            dashOffset,
            strokeColor: getChartColor(item.color ?? "MAIN"),
            index,
          },
        ],
        cumulative: acc.cumulative + percent,
      };
    },
    { list: [], cumulative: 0 },
  );

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={size}
          height={size}
          className="-rotate-90"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={STROKE_WIDTH}
          />

          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={segment.strokeColor}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={segment.dashArray}
              strokeDashoffset={segment.dashOffset}
              strokeLinecap="butt"
              className="cursor-pointer transition-opacity duration-200"
              style={{
                opacity:
                  activeIndex === null || activeIndex === segment.index
                    ? 1
                    : 0.3,
              }}
              onMouseEnter={() => setActiveIndex(segment.index)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          ))}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="text-xl font-bold tabular-nums">
            {activeIndex !== null
              ? formatValue(segments[activeIndex].value)
              : formatValue(total)}
          </span>

          <span className="max-w-24 truncate text-xs text-muted-foreground">
            {activeIndex !== null ? segments[activeIndex].label : "الإجمالي"}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-36">
        {segments.map((segment) => (
          <button
            key={segment.label}
            type="button"
            onMouseEnter={() => setActiveIndex(segment.index)}
            onMouseLeave={() => setActiveIndex(null)}
            className="flex cursor-pointer items-center justify-between gap-4 text-sm transition-opacity"
            style={{
              opacity:
                activeIndex === null || activeIndex === segment.index ? 1 : 0.5,
            }}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.strokeColor }}
              />

              <span className="truncate text-muted-foreground">
                {segment.label}
              </span>
            </span>

            <span className="shrink-0 font-bold">
              {formatValue(segment.value)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
