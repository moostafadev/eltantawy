"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
        rel="noopener noreferrer"
        aria-label={`فتح الصفحة: ${path}`}
        className="inline-flex items-center gap-1.5 font-medium text-main hover:underline"
      >
        <span>فتح الصفحة</span>
        <ExternalLink aria-hidden="true" className="size-3.5" />
      </Link>
    ),
    className: "text-center",
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
