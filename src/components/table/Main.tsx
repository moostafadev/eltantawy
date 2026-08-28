"use client";

import { List } from "lucide-react";

import { TableProps } from "./types";
import { Skeleton } from "@/components/skeleton";
import Spin from "@/components/icons/Spin";

const Table = <T,>({
  data,
  columns,
  emptyMessage = "لا توجد بيانات",
  loading = false,
  loadingRows = 8,
  className = "",
}: TableProps<T>) => {
  return (
    <div
      className={`w-full overflow-hidden border border-background-second/60 bg-background shadow-sm ${className}`}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-200 border-collapse text-sm">
          {/* Header */}
          <thead>
            <tr className="bg-background-second/20">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`whitespace-nowrap border-b border-background-second/50 px-4 py-3 text-right text-xs font-bold text-foreground/70 lg:px-5 lg:py-4 ${column.className ?? ""}`}
                >
                  {loading ? (
                    <Skeleton height={12} className="w-20" />
                  ) : (
                    column.title
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
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
                      <Skeleton
                        height={14}
                        className={` ${columnIndex === 0 ? "w-32" : "w-20"}`}
                      />
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

                    <p className="text-xs text-foreground/50">
                      لا توجد بيانات لعرضها حاليًا
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-background-second/50 bg-background-second/5 px-2 py-1.5 lg:px-5 lg:py-2.5">
        <div className="mr-auto flex items-center gap-2 text-xs text-foreground/60 lg:text-sm">
          <div className="flex size-7 items-center justify-center bg-main/10 text-main">
            <List className="size-3.5 lg:size-4" />
          </div>

          <span className="flex size-7 items-center justify-center bg-background-second/40 px-2 py-1 font-bold text-foreground">
            {loading ? <Spin className="size-7" /> : data.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Table;
