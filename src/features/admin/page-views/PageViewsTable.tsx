"use client";

import Link from "next/link";
import { ArrowDown, ArrowDownUp, ArrowUp, ExternalLink } from "lucide-react";

import { Table } from "@/components/table";
import { TableColumn } from "@/components/table/types";
import { Skeleton } from "@/components/skeleton";
import type {
  TablePaginationData,
  TableSortState,
} from "@/components/table/pagination";
import { Tag } from "@/components/tag";
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
}) => {
  const mobileSortHref = () => {
    const params = new URLSearchParams({ page: "1" });

    if (sorting?.field !== "views") {
      params.set("sort", "views");
      params.set("direction", "desc");
    } else if (sorting.direction === "desc") {
      params.set("sort", "views");
      params.set("direction", "asc");
    }

    return `${pagination?.basePath}?${params.toString()}`;
  };

  const mobileContent = loading ? (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex justify-end px-1">
        <Skeleton width={100} height={12} />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex min-w-0 items-center justify-between gap-2 border border-background-second/30 p-2.5"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton width={120} height={14} className="max-w-full" />
            <Skeleton width={82} height={12} className="max-w-full" />
          </div>
          <Skeleton width={62} height={24} className="shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  ) : data.length > 0 ? (
    <div className="flex flex-col gap-2 p-2">
      {pagination && (
        <div className="flex justify-end px-1">
          <Link
            href={mobileSortHref()}
            prefetch={false}
            className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/70"
          >
            <span>عدد المشاهدات</span>
            {sorting?.field === "views" ? (
              sorting.direction === "asc" ? (
                <ArrowUp className="size-3.5 text-main" />
              ) : (
                <ArrowDown className="size-3.5 text-main" />
              )
            ) : (
              <ArrowDownUp className="size-3.5 opacity-50" />
            )}
          </Link>
        </div>
      )}
      {data.map(({ path, name, views }) => (
        <article
          key={path}
          className="flex min-w-0 items-center justify-between gap-2 border border-background-second/30 p-2.5"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate text-sm font-medium">{name}</span>
            <Link
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`فتح الصفحة: ${path}`}
              className="inline-flex w-fit items-center gap-1 text-xs font-medium text-main hover:underline"
            >
              <span>فتح الصفحة</span>
              <ExternalLink aria-hidden="true" className="size-3" />
            </Link>
          </div>
          <Tag
            color="INFO"
            variant="soft"
            size="xs"
            className="shrink-0 tabular-nums"
          >
            {toArabicNums(views)}
            <span>مشاهدة</span>
          </Tag>
        </article>
      ))}
    </div>
  ) : (
    <p className="px-3 py-6 text-center text-sm text-muted-foreground">
      لا توجد مشاهدات مسجلة حتى الآن
    </p>
  );

  return (
    <Table
      data={data}
      columns={pageViewColumns}
      emptyMessage="لا توجد مشاهدات مسجلة حتى الآن"
      loading={loading}
      loadingRows={5}
      mobileContent={mobileContent}
      pagination={pagination}
      sorting={sorting}
    />
  );
};

export default PageViewsTable;
