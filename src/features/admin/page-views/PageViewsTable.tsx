"use client";

import Link from "next/link";

import { Table } from "@/components/table";
import { TableColumn } from "@/components/table/types";
import type {
  TablePaginationData,
  TableSortState,
} from "@/components/table/pagination";
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
    sortKey: "views",
    defaultSortDirection: "desc",
    render: ({ views }) => (
      <span className="font-bold tabular-nums">{toArabicNums(views)}</span>
    ),
  },
];

const PageViewsTable = ({
  data,
  loading = false,
  pagination,
  sorting,
}: {
  data: PageViewRow[];
  loading?: boolean;
  pagination?: TablePaginationData & { basePath: string };
  sorting?: TableSortState;
}) => (
  <Table
    data={data}
    columns={pageViewColumns}
    emptyMessage="لا توجد مشاهدات مسجلة حتى الآن"
    loading={loading}
    loadingRows={5}
    pagination={pagination}
    sorting={sorting}
  />
);

export default PageViewsTable;
