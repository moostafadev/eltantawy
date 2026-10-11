"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  List,
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
} from "lucide-react";
import type { ReactNode } from "react";

import type { TableProps } from "./types";
import { getColor } from "@/components/button/lib";
import Spin from "@/components/icons/Spin";
import { Skeleton } from "@/components/skeleton";
import Link from "next/link";

/**
 * Generic data table. Columns are described via `TableColumn<T>[]`
 * (`key`, `title`, optional `render`). Pass `loading` with `loadingRows`
 * to show skeleton rows instead of `data` while fetching. Server-paginated
 * data can pass `pagination` metadata to render URL-based page controls.
 *
 * @example
 * <Table data={products} columns={productsTableColumns} emptyMessage="No products found" />
 */
const Table = <T,>({
  data,
  columns,
  emptyMessage = "لا توجد بيانات",
  loading = false,
  loadingRows = 8,
  className = "",
  mobileContent,
  pagination,
  sorting,
}: TableProps<T>) => {
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize))
    : 1;
  const firstItem = pagination?.totalItems
    ? (pagination.page - 1) * pagination.pageSize + 1
    : 0;
  const lastItem = pagination
    ? Math.min(pagination.page * pagination.pageSize, pagination.totalItems)
    : 0;
  const visiblePages = pagination
    ? Array.from(
        { length: Math.min(5, totalPages) },
        (_, index) =>
          Math.max(1, Math.min(pagination.page - 2, totalPages - 4)) + index,
      )
    : [];

  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (sorting) {
      params.set("sort", sorting.field);
      params.set("direction", sorting.direction);
    }
    return `${pagination?.basePath}?${params.toString()}`;
  };

  const sortHref = (sortKey: string, defaultDirection: "asc" | "desc") => {
    const params = new URLSearchParams();
    params.set("page", "1");

    if (sorting?.field !== sortKey) {
      params.set("sort", sortKey);
      params.set("direction", defaultDirection);
    } else if (sorting.direction === defaultDirection) {
      params.set("sort", sortKey);
      params.set("direction", defaultDirection === "asc" ? "desc" : "asc");
    }

    return `${pagination?.basePath}?${params.toString()}`;
  };

  const pageControl = (
    page: number,
    label: string,
    icon: ReactNode,
    disabled: boolean,
    className = "",
  ) =>
    disabled ? (
      <span
        aria-disabled="true"
        aria-label={label}
        className={`flex size-8 shrink-0 items-center justify-center text-foreground/40 opacity-60 sm:size-9 ${className}`}
      >
        {icon}
      </span>
    ) : (
      <Link
        href={pageHref(page)}
        prefetch={false}
        aria-label={label}
        className={`flex size-8 shrink-0 items-center justify-center transition-all duration-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/40 sm:size-9 ${getColor("SECONDARY", "soft")} ${className}`}
      >
        {icon}
      </Link>
    );

  return (
    <div
      className={`w-full min-w-0 overflow-hidden border border-background-second/60 bg-background shadow-sm ${className}`}
    >
      {mobileContent && (
        <div className="sm:hidden">{mobileContent}</div>
      )}

      <div className={mobileContent ? "hidden w-full overflow-x-auto sm:block" : "w-full overflow-x-auto"}>
        <table className="w-full min-w-200 border-collapse text-sm">
          <thead>
            <tr className="bg-background-second/20">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`whitespace-nowrap border-b border-background-second/50 px-4 py-3 text-right text-xs font-bold text-foreground/70 lg:px-5 lg:py-4 ${column.className ?? ""}`}
                >
                  {loading ? (
                    <Skeleton width={80} height={12} />
                  ) : column.sortKey && pagination ? (
                    <Link
                      href={sortHref(
                        column.sortKey,
                        column.defaultSortDirection ?? "asc",
                      )}
                      prefetch={false}
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-main"
                      aria-label={`ترتيب حسب ${typeof column.title === "string" ? column.title : column.sortKey}`}
                    >
                      <span>{column.title}</span>
                      {sorting?.field === column.sortKey ? (
                        sorting.direction === "asc" ? (
                          <ArrowUp className="size-3.5 shrink-0 text-main" />
                        ) : (
                          <ArrowDown className="size-3.5 shrink-0 text-main" />
                        )
                      ) : (
                        <ArrowDownUp className="size-3.5 shrink-0 opacity-40" />
                      )}
                    </Link>
                  ) : (
                    column.title
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-background-second/30 last:border-b-0"
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={String(column.key)}
                      className={`whitespace-nowrap px-4 py-1.5 text-right text-foreground lg:px-5 lg:py-2.5 ${column.className ?? ""}`}
                    >
                      {column.skeleton ?? (
                        <Skeleton
                          width={columnIndex === 0 ? 128 : 80}
                          height={14}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={String((item as { id?: string }).id ?? index)}
                  className="group border-b border-background-second/30 transition-colors duration-300 last:border-b-0 hover:bg-background-second/10"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`whitespace-nowrap px-4 py-1.5 text-right text-foreground lg:px-5 lg:py-2.5 ${column.className ?? ""}`}
                    >
                      {column.render
                        ? column.render(item, index)
                        : String(item[column.key as keyof T] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex size-12 items-center justify-center rounded-full bg-background-second/30 text-main">
                      —
                    </div>

                    <p className="text-sm font-semibold text-foreground">
                      {emptyMessage}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      لا توجد بيانات لعرضها حاليًا
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-background-second/50 bg-background-second/5 px-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-3 sm:py-3 lg:px-5">
        <div className="flex w-full items-center gap-1.5 text-[11px] text-foreground/60 sm:w-auto sm:gap-2 sm:text-xs lg:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center bg-main/10 text-main sm:size-9">
              <List className="size-3.5 sm:size-4" />
            </span>
            <span className="hidden sm:inline">إجمالي السجلات</span>
            <span className="hidden bg-main/10 px-2.5 py-1.5 font-bold tabular-nums text-main sm:inline-flex">
              {loading ? (
                <Spin className="size-4" />
              ) : (
                (pagination?.totalItems ?? data.length)
              )}
            </span>
            {pagination && !loading ? (
              <span className="whitespace-nowrap font-medium text-foreground/70 sm:hidden">
                عرض{" "}
                <span className="font-bold tabular-nums text-foreground">
                  {firstItem}-{lastItem}
                </span>{" "}
                من{" "}
                <span className="font-bold tabular-nums text-foreground">
                  {pagination.totalItems}
                </span>
              </span>
            ) : (
              <span className="bg-main/10 px-2 py-1 font-bold tabular-nums text-main sm:hidden">
                {loading ? <Spin className="size-4" /> : data.length}
              </span>
            )}
          </div>
        </div>

        {pagination && !loading && totalPages > 1 && (
          <nav
            aria-label="التنقل بين صفحات الجدول"
            className="flex w-full items-center justify-center gap-1.5 text-[11px] text-foreground/70 sm:w-auto sm:gap-2 sm:text-xs sm:justify-center"
          >
            <span className="hidden whitespace-nowrap sm:inline">
              عرض {firstItem}-{lastItem} من {pagination.totalItems}
            </span>

            <div className="flex w-full items-center justify-between gap-0.5 sm:w-auto sm:gap-1 sm:justify-center">
              {pageControl(
                1,
                "الصفحة الأولى",
                <ChevronsRight className="size-3.5 sm:size-4" />,
                pagination.page <= 1,
                "hidden sm:flex",
              )}
              {pageControl(
                pagination.page - 1,
                "الصفحة السابقة",
                <ChevronRight className="size-3.5 sm:size-4" />,
                pagination.page <= 1,
              )}

              <span className="flex h-8 min-w-16 items-center justify-center bg-main/10 px-2 font-bold tabular-nums text-main sm:hidden">
                {pagination.page}
                <span aria-hidden="true" className="mx-1 font-normal text-main/60">
                  /
                </span>
                {totalPages}
              </span>

              {visiblePages.map((page) =>
                page === pagination.page ? (
                  <span
                    key={page}
                    aria-current="page"
                    className={`hidden size-9 items-center justify-center font-bold tabular-nums shadow-sm sm:flex ${getColor("MAIN", "solid")}`}
                  >
                    {page}
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={pageHref(page)}
                    prefetch={false}
                    aria-label={`الصفحة ${page}`}
                    className={`hidden size-9 items-center justify-center tabular-nums transition-all duration-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/40 sm:flex ${getColor("SECONDARY", "soft")}`}
                  >
                    {page}
                  </Link>
                ),
              )}

              {pageControl(
                pagination.page + 1,
                "الصفحة التالية",
                <ChevronLeft className="size-3.5 sm:size-4" />,
                pagination.page >= totalPages,
              )}
              {pageControl(
                totalPages,
                "الصفحة الأخيرة",
                <ChevronsLeft className="size-3.5 sm:size-4" />,
                pagination.page >= totalPages,
                "hidden sm:flex",
              )}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Table;
