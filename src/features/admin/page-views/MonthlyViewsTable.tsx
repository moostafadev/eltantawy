"use client";

import { Tag } from "@/components/tag";
import { Table } from "@/components/table";
import { TableColumn } from "@/components/table/types";
import { toArabicNums } from "@/utils/toArabicNums";

import { MonthlyPageViews } from "./pageViews.service";

const columns: TableColumn<MonthlyPageViews>[] = [
  {
    key: "label",
    title: "الشهر",
    render: ({ label }) => <span className="font-medium">{label}</span>,
  },
  {
    key: "value",
    title: <div className="flex justify-center">عدد المشاهدات</div>,
    render: ({ value }) => (
      <span className="flex justify-center font-medium">
        {toArabicNums(value)}
      </span>
    ),
  },
  {
    key: "change",
    title: <div className="flex justify-center">نسبة التغيير</div>,
    render: ({ change }) => (
      <div className="flex justify-center">
        {change === null ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <Tag
            color={change > 0 ? "SUCCESS" : change < 0 ? "DANGER" : "NEUTRAL"}
            variant="soft"
            size="sm"
          >
            {change > 0 ? "+" : ""}
            {toArabicNums(String(Math.round(change)))}%
          </Tag>
        )}
      </div>
    ),
  },
];

const MonthlyViewsTable = ({ data }: { data: MonthlyPageViews[] }) => (
  <Table
    data={data}
    columns={columns}
    emptyMessage="لا توجد بيانات مشاهدات بعد"
  />
);

export default MonthlyViewsTable;
