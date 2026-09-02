"use client";

import Link from "next/link";
import { Eye, Pen } from "lucide-react";

import { Button } from "@/components/button";
import { TableColumn } from "@/components/table/types";
import { toArabicNums } from "@/utils/toArabicNums";

import { Product } from "./types";
import { DeleteProductButton } from "./deleteProduct";

export const productsTableColumns: TableColumn<Product>[] = [
  {
    key: "title",
    title: "المنتج",
    render: (product) => <span className="font-medium">{product.title}</span>,
  },

  {
    key: "category",
    title: "التصنيف",
    render: (product) => <span>{product.category?.title || "بدون تصنيف"}</span>,
  },

  {
    key: "price",
    title: <div className="flex justify-center">السعر</div>,
    render: (product) => (
      <span className="flex justify-center font-medium">
        {toArabicNums(String(product.price))} ج.م
      </span>
    ),
  },

  {
    key: "discountPrice",
    title: <div className="flex justify-center">سعر الخصم</div>,
    render: (product) => (
      <span className="flex justify-center font-medium">
        {product.discountPrice !== null
          ? `${toArabicNums(String(product.discountPrice))} ج.م`
          : "—"}
      </span>
    ),
  },

  {
    key: "unit",
    title: <div className="flex justify-center">الوحدة</div>,
    render: (product) => (
      <span className="flex justify-center">
        {product.unit === "KG" ? "كيلو" : "قطعة"}
      </span>
    ),
  },

  {
    key: "saleType",
    title: <div className="flex justify-center">نوع البيع</div>,
    render: (product) => (
      <span className="flex justify-center">
        {product.saleType === "WEIGHT_RANGE" ? "نطاق وزن" : "عادي"}
      </span>
    ),
  },

  {
    key: "createdAt",
    title: <div className="flex justify-end">تاريخ الإنشاء</div>,
    render: (product) => (
      <span className="flex justify-end">
        {new Date(product.createdAt).toLocaleDateString("ar-EG")}
      </span>
    ),
  },

  {
    key: "options",
    title: <div className="flex justify-center">التحكم</div>,
    render: (product) => (
      <div className="flex justify-center gap-1">
        <Link href={`/admin/products/${product.id}`}>
          <Button size="icon" color="NEUTRAL" variant="outline">
            <Eye className="size-4 lg:size-5" />
          </Button>
        </Link>

        <Link href={`/admin/products/${product.id}/edit`}>
          <Button size="icon" color="INFO" variant="soft">
            <Pen className="size-4 lg:size-5" />
          </Button>
        </Link>

        <DeleteProductButton id={product.id} />
      </div>
    ),
  },
];
