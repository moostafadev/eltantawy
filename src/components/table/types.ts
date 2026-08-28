import { ReactNode } from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  title: ReactNode;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  emptyMessage?: string;
  loading?: boolean;
  loadingRows?: number;
  className?: string;
}
