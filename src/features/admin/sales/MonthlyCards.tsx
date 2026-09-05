import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { toArabicNums } from "@/utils/toArabicNums";

import { MonthlySalesRow } from "./types";

interface Props {
  data: MonthlySalesRow[];
}

const MonthlyCards = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 lg:gap-3">
      {data.map((month) => {
        const isUp = month.change !== null && month.change > 0;
        const isDown = month.change !== null && month.change < 0;

        const colorClass = isUp
          ? "text-success"
          : isDown
            ? "text-danger"
            : "text-muted-foreground";
        const bgClass = isUp
          ? "bg-success/10"
          : isDown
            ? "bg-danger/10"
            : "bg-muted";
        const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

        return (
          <div
            key={month.label}
            className="flex flex-col gap-2 border border-background-second/20 bg-background p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {month.label}
              </span>

              <div
                className={`flex size-6 shrink-0 items-center justify-center ${bgClass} ${colorClass}`}
              >
                <Icon className="size-3.5" />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-bold tabular-nums">
                {toArabicNums(String(Math.round(month.value)))}
              </span>

              <span className="text-[10px] text-muted-foreground">ج.م</span>
            </div>

            <span
              className={`text-xs font-semibold ${month.change === null ? "text-muted-foreground" : colorClass}`}
            >
              {month.change === null
                ? "—"
                : `${isUp ? "+" : ""}${toArabicNums(String(Math.round(month.change)))}%`}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MonthlyCards;
