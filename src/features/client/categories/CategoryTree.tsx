"use client";

import { ChevronDown, FolderTree, Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Card } from "@/components/card";

import type { getCategoriesForStore } from "./category.service";
import CategoryProducts from "./CategoryProducts";

type CategoryNode = Awaited<ReturnType<typeof getCategoriesForStore>>[number];

interface CategoryTreeProps {
  categories: CategoryNode[];
}

const CategoryTree = ({ categories }: CategoryTreeProps) => {
  return (
    <div className="flex flex-col gap-2.5">
      {categories.map((category) => (
        <CategoryNodeItem key={category.id} category={category} level={0} />
      ))}
    </div>
  );
};

interface CategoryNodeItemProps {
  category: CategoryNode;
  level: number;
}

const CategoryNodeItem = ({ category, level }: CategoryNodeItemProps) => {
  const [open, setOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  const hasChildren = category.children.length > 0;
  const hasProducts = category.products.length > 0;
  const canOpen = hasChildren || hasProducts;

  return (
    <div className="flex flex-col">
      <Card
        className={`overflow-hidden transition-all duration-300 ${
          open ? "border-main/30 shadow-sm" : "hover:border-main/20"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            if (canOpen) {
              setOpen((value) => !value);

              if (!hasProducts) {
                setShowProducts(false);
              }
            }
          }}
          disabled={!canOpen}
          className="flex w-full cursor-pointer items-center gap-3 p-3 text-start transition-colors hover:bg-main/5 disabled:cursor-default lg:p-4"
        >
          <div
            className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-muted ${
              level === 0 ? "size-12 lg:size-14" : "size-10 lg:size-11"
            }`}
          >
            {category.image ? (
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes={level === 0 ? "56px" : "44px"}
                className="object-cover"
              />
            ) : (
              <FolderTree
                className={`text-main ${level === 0 ? "size-6" : "size-5"}`}
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className={`truncate font-bold ${level > 0 ? "text-sm" : ""}`}
              >
                {category.title}
              </h2>

              {category.totalProductsCount > 0 && (
                <span className="bg-main/10 px-2 py-0.5 text-xs font-medium text-main">
                  {category.totalProductsCount} منتج
                </span>
              )}
            </div>

            {category.desc && (
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {category.desc}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {hasChildren && (
              <span className="hidden text-xs text-muted-foreground sm:block">
                {category.children.length} تصنيف فرعي
              </span>
            )}

            <ChevronDown
              className={`size-5 text-muted-foreground transition-transform duration-300 ${
                open ? "rotate-180 text-main" : ""
              }`}
            />
          </div>
        </button>

        {open && (
          <div className="animate-dialog-content-in border-t border-border bg-muted/20 p-3 lg:p-4">
            <div className="flex flex-col gap-3">
              {hasProducts && (
                <button
                  type="button"
                  onClick={() => setShowProducts((value) => !value)}
                  className={`flex cursor-pointer items-center justify-between gap-3 border p-3 text-start text-sm font-medium transition-colors ${
                    showProducts
                      ? "border-main/30 bg-main/5 text-main"
                      : "border-border bg-background hover:border-main/30 hover:bg-main/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Package className="size-4" />
                    <span>عرض منتجات {category.title}</span>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {category.productsCount} منتج
                    <ChevronDown
                      className={`size-3.5 transition-transform duration-300 ${
                        showProducts ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>
              )}

              {showProducts && <CategoryProducts category={category} />}

              {hasChildren && (
                <div className="flex flex-col gap-2">
                  {category.children.map((child) => (
                    <CategoryNodeItem
                      key={child.id}
                      category={child}
                      level={level + 1}
                    />
                  ))}
                </div>
              )}

              {!hasChildren && !hasProducts && (
                <Card className="flex items-center justify-center py-6 text-sm text-muted-foreground shadow-none">
                  لا توجد منتجات في هذا التصنيف
                </Card>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CategoryTree;

export { CategoryTree };
