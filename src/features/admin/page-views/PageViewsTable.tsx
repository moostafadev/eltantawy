"use client";

import Link from "next/link";

import { Table } from "@/components/table";
import { TableColumn } from "@/components/table/types";
import { toArabicNums } from "@/utils/toArabicNums";

type PageViewRow = {
  path: string;
  name: string;
  views: number;
};

const pageViewColumns: TableColumn<PageViewRow>[] = [
  {
    key: "name",
    title: "اسم الصفحة",
    render: ({ name }) => <span className="font-medium">{name}</span>,
  },
  {
    key: "path",
    title: "المسار",
    render: ({ path }) => (
      <Link
        href={path}
        target="_blank"
        rel="noreferrer"
        className="text-main hover:underline"
        dir="ltr"
      >
        {path}
      </Link>
    ),
    className: "break-all",
  },
  {
    key: "views",
    title: "عدد المشاهدات",
    render: ({ views }) => (
      <span className="font-bold tabular-nums">{toArabicNums(views)}</span>
    ),
  },
];

const PageViewsTable = ({ data }: { data: PageViewRow[] }) => (
  <Table
    data={data}
    columns={pageViewColumns}
    emptyMessage="لا توجد مشاهدات مسجلة حتى الآن"
  />
);

export default PageViewsTable;
