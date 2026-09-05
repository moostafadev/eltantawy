"use client";

import { TableColumn } from "@/components/table/types";
import { TopProduct } from "./types";
import { toArabicNums } from "@/utils/toArabicNums";

export const topProductsColumns: TableColumn<TopProduct>[] = [
  {
    key: "title",
    title: "المنتج",
    render: (product) => <span className="font-medium">{product.title}</span>,
  },

  {
    key: "qty",
    title: <div className="flex justify-center">الكمية المباعة</div>,
    render: (product) => (
      <span className="flex justify-center font-medium">
        {toArabicNums(product.qty)}
      </span>
    ),
  },

  {
    key: "total",
    title: <div className="flex justify-end">إجمالي المبيعات</div>,
    render: (product) => (
      <span className="flex justify-end font-bold text-main">
        {toArabicNums(String(product.total))} ج.م
      </span>
    ),
  },
];
