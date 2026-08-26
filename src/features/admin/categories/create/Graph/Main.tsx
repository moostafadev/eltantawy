"use client";

import { memo, useContext, useMemo } from "react";
import { FolderTree } from "lucide-react";

import CategoryNode from "./Node";
import { IGraphProps } from "./types";
import { CategoryCreateStateContext } from "../store";

const CategoryGraph = ({ categories, selectedId }: IGraphProps) => {
  const context = useContext(CategoryCreateStateContext);

  const currentSelectedId = selectedId ?? context?.selectedParentId;

  const selectedCategory = useMemo(() => {
    if (!currentSelectedId) {
      return undefined;
    }

    return categories.find((category) => category.id === currentSelectedId);
  }, [categories, currentSelectedId]);

  if (!currentSelectedId) {
    return (
      <div className="flex min-h-64 flex-1 flex-col items-center justify-center border border-dashed border-background-second bg-muted/20 px-6 text-center">
        <div className="mb-3 flex size-12 items-center justify-center bg-muted">
          <FolderTree className="size-5 text-muted-foreground" />
        </div>

        <p className="text-sm font-medium">اختر تصنيفًا لعرض الهيكل</p>

        <p className="mt-1 text-xs text-muted-foreground">
          ستظهر هنا جميع التصنيفات الفرعية التابعة له
        </p>
      </div>
    );
  }

  if (!selectedCategory) {
    return null;
  }

  return (
    <section className="flex-1 overflow-hidden border border-background-second bg-background shadow-sm">
      <div className="flex items-center justify-between border-b border-background-second bg-muted/30 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">هيكل التصنيف</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            التصنيفات التابعة لـ {selectedCategory.title}
          </p>
        </div>

        <div className="flex size-9 items-center justify-center bg-main/10 text-main">
          <FolderTree className="size-4" />
        </div>
      </div>

      <div className="overflow-x-auto p-8">
        <div className="flex min-w-max justify-center">
          <CategoryNode
            category={selectedCategory}
            categories={categories}
            isRoot
          />
        </div>
      </div>
    </section>
  );
};

export default memo(CategoryGraph);
