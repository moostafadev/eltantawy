import { FolderTree } from "lucide-react";

import { INodeProps } from "./types";

const CategoryNode = ({ category, categories, isRoot = false }: INodeProps) => {
  const children = categories.filter((item) => item.parentId === category.id);

  const hasChildren = children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`group relative z-10 min-w-48 border bg-background px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          isRoot ? "border-main/40 shadow-main/5" : "border-border"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center ${
              isRoot ? "bg-main/10 text-main" : "bg-muted text-muted-foreground"
            }`}
          >
            <FolderTree className="size-4" />
          </div>

          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-semibold">{category.title}</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {hasChildren
                ? `${children.length} تصنيف فرعي`
                : "بدون تصنيفات فرعية"}
            </p>
          </div>
        </div>

        {isRoot && (
          <div className="absolute -top-2.5 right-4 bg-main px-2.5 py-0.5 text-[10px] font-medium text-main-foreground">
            التصنيف المحدد
          </div>
        )}
      </div>

      {hasChildren && (
        <>
          <div className="h-8 w-px bg-border" />

          <div className="relative flex gap-6 pt-0">
            {children.map((child) => (
              <div
                key={child.id}
                className="relative flex flex-col items-center"
              >
                <div className="absolute -top-px left-1/2 h-px w-[calc(100%+1.5rem)] -translate-x-1/2 bg-border" />

                <div className="h-8 w-px bg-border" />

                <CategoryNode category={child} categories={categories} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryNode;
