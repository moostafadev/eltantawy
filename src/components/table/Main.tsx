"use client";

import { TableProps } from "./types";

const Table = <T,>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "لا توجد بيانات",
  className = "",
}: TableProps<T>) => {
  return (
    <div
      className={`
        w-full
        overflow-hidden
        border
        border-background-second/60
        bg-background
        shadow-sm
        ${className}
      `}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-200 border-collapse text-sm">
          {/* Header */}
          <thead>
            <tr className="bg-background-second/20">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    whitespace-nowrap
                    border-b
                    border-background-second/50
                    px-4 lg:px-5
                    py-3 lg:py-4
                    text-right
                    text-xs
                    font-bold
                    text-foreground/70
                    ${column.className ?? ""}
                  `}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={keyExtractor ? keyExtractor(item, index) : index}
                  className="
                    group
                    border-b
                    border-background-second/30
                    transition-colors
                    duration-150
                    last:border-b-0
                    hover:bg-background-second/10
                  "
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`
                        whitespace-nowrap
                        px-4 lg:px-5
                        py-3 lg:py-4
                        text-right
                        text-foreground
                        ${column.className ?? ""}
                      `}
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
                    <div
                      className="
                        flex
                        size-12
                        items-center
                        justify-center
                        rounded-full
                        bg-background-second/30
                        text-main
                      "
                    >
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
    </div>
  );
};

export default Table;
