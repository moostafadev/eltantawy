import { TableColumn } from "@/components/table/types";

import { Category } from "./types";
import { toArabicNums } from "@/utils/toArabicNums";

export const categoriesTableColumns: TableColumn<Category>[] = [
  {
    key: "title",
    title: "التصنيف",
    render: (category) => <span className="font-medium">{category.title}</span>,
  },

  {
    key: "desc",
    title: "الوصف",
    render: (category) => (
      <span className="text-sm text-muted-foreground">
        {category.desc || "—"}
      </span>
    ),
  },

  {
    key: "parent",
    title: "التصنيف الأب",
    render: (category) => (
      <span>{category.parent?.title || "تصنيف رئيسي"}</span>
    ),
  },

  {
    key: "products",
    title: "المنتجات",
    render: (category) => (
      <span className="font-medium">
        {String(toArabicNums(category._count.products))}
      </span>
    ),
  },

  {
    key: "children",
    title: "التصنيفات الفرعية",
    render: (category) => (
      <span className="font-medium">
        {String(toArabicNums(category._count.children))}
      </span>
    ),
  },

  {
    key: "createdAt",
    title: "تاريخ الإنشاء",
    render: (category) => (
      <span>{new Date(category.createdAt).toLocaleDateString("ar-EG")}</span>
    ),
  },
];
