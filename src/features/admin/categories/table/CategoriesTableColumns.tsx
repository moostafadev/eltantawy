import { TableColumn } from "@/components/table/types";

import { Category } from "./types";
import { toArabicNums } from "@/utils/toArabicNums";
import { Button } from "@/components/button";
import Link from "next/link";
import { Eye, Pen } from "lucide-react";
import DeleteCategoryButton from "./DeleteCategoryButton";

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
    title: <div className="flex justify-center">المنتجات</div>,
    render: (category) => (
      <span className="font-medium flex justify-center">
        {String(toArabicNums(category._count.products))}
      </span>
    ),
  },

  {
    key: "children",
    title: <div className="flex justify-center">التصنيفات الفرعية</div>,
    render: (category) => (
      <span className="font-medium flex justify-center">
        {String(toArabicNums(category._count.children))}
      </span>
    ),
  },

  {
    key: "createdAt",
    title: <div className="flex justify-end">تاريخ الإنشاء</div>,
    render: (category) => (
      <span className="flex justify-end">
        {new Date(category.createdAt).toLocaleDateString("ar-EG")}
      </span>
    ),
  },
  {
    key: "options",
    title: <div className="flex justify-center">التحكم</div>,
    render: (category) => (
      <div className="flex justify-center gap-1">
        <Link href={`/admin/products/categories/${category.id}`}>
          <Button size="icon" color="NEUTRAL" variant="outline">
            <Eye className="size-4 lg:size-5" />
          </Button>
        </Link>
        <Link href={`/admin/products/categories/${category.id}/edit`}>
          <Button size="icon" color="INFO" variant="outline">
            <Pen className="size-4 lg:size-5" />
          </Button>
        </Link>
        <DeleteCategoryButton id={category.id} />
      </div>
    ),
  },
];
