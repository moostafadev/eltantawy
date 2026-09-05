"use client";

import { Tag } from "@/components/tag";
import { TableColumn } from "@/components/table/types";
import { toArabicNums } from "@/utils/toArabicNums";

import { MonthlySalesRow } from "./types";

export const monthlyTableColumns: TableColumn<MonthlySalesRow>[] = [
  {
    key: "label",
    title: "الشهر",
    render: (month) => <span className="font-medium">{month.label}</span>,
  },

  {
    key: "value",
    title: <div className="flex justify-center">صافي المبيعات</div>,
    render: (month) => (
      <span className="flex justify-center font-medium">
        {toArabicNums(String(Math.round(month.value)))} ج.م
      </span>
    ),
  },

  {
    key: "change",
    title: <div className="flex justify-center">نسبة التغيير</div>,
    render: (month) => (
      <div className="flex justify-center">
        {month.change === null ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <Tag
            color={
              month.change > 0
                ? "SUCCESS"
                : month.change < 0
                  ? "DANGER"
                  : "NEUTRAL"
            }
            variant="soft"
            size="sm"
          >
            {month.change > 0 ? "+" : ""}
            {toArabicNums(String(Math.round(month.change)))}%
          </Tag>
        )}
      </div>
    ),
  },
];
