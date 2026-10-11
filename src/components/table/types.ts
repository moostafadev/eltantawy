import { ReactNode } from "react";
import type { TablePaginationData, TableSortState } from "./pagination";

export interface TableColumn<T> {
  key: keyof T | string;
  title: ReactNode;
  render?: (item: T, index: number) => ReactNode;
  skeleton?: ReactNode;
  className?: string;
  sortKey?: string;
  defaultSortDirection?: "asc" | "desc";
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  mobileContent?: ReactNode;
  pagination?: TablePaginationData & {
    basePath: string;
  };
  sorting?: TableSortState;
  emptyMessage?: string;
  loading?: boolean;
  loadingRows?: number;
  className?: string;
}
