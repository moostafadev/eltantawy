export const TABLE_PAGE_SIZE = 10;

export type TableSortDirection = "asc" | "desc";

export interface TableSortState {
  field: string;
  direction: TableSortDirection;
}

export interface TablePaginationData {
  page: number;
  pageSize: number;
  totalItems: number;
}

export const resolveTableSort = (
  field: string | undefined,
  direction: string | undefined,
  sortableFields: readonly string[],
): TableSortState | undefined =>
  field && sortableFields.includes(field)
    ? {
        field,
        direction: direction === "asc" ? "asc" : "desc",
      }
    : undefined;

export const parsePage = (value?: string) => {
  const page = Number(value);

  return Number.isSafeInteger(page) && page > 0 ? page : 1;
};

export const getTablePagination = (
  requestedPage: number,
  totalItems: number,
  pageSize = TABLE_PAGE_SIZE,
): TablePaginationData => ({
  page: Math.min(requestedPage, Math.max(1, Math.ceil(totalItems / pageSize))),
  pageSize,
  totalItems,
});
