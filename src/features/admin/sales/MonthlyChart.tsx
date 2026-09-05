import { toArabicNums } from "@/utils/toArabicNums";

import { MonthlySales } from "./types";

interface Props {
  data: MonthlySales[];
}

const MonthlyChart = ({ data }: Props) => {
  const maxValue = Math.max(...data.map((month) => month.value), 1);

  return (
    <div className="flex flex-1 items-end justify-between gap-2 lg:gap-3">
      {data.map((month) => {
        const heightPercent = Math.max((month.value / maxValue) * 100, 2);

        return (
          <div
            key={month.label}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <span className="text-xs font-semibold text-foreground">
              {month.value > 0
                ? toArabicNums(String(Math.round(month.value)))
                : "—"}
            </span>

            <div className="flex h-32 w-full items-end overflow-hidden bg-muted/40 lg:h-40">
              <div
                className="w-full bg-main transition-all duration-500"
                style={{ height: `${heightPercent}%` }}
              />
            </div>

            <span className="text-xs text-muted-foreground">{month.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MonthlyChart;
