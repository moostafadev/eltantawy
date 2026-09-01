"use client";

import { Button } from "@/components/button";

import type { getCategoriesForStore } from "./category.service";
import { ProductCard } from "../product-card";

type CategoryNode = Awaited<ReturnType<typeof getCategoriesForStore>>[number];

interface CategorySubSectionProps {
  category: CategoryNode;
  level: number;
}

const scrollToCategory = (id: string) => {
  document
    .getElementById(`category-${id}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const CategorySubSection = ({ category, level }: CategorySubSectionProps) => {
  if (category.totalProductsCount === 0) return null;

  const visibleChildren = category.children.filter(
    (child) => child.totalProductsCount > 0,
  );

  return (
    <div
      id={`category-${category.id}`}
      className="scroll-mt-16 border-r-2 border-main/20 pr-3 lg:scroll-mt-36 lg:pr-4"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="size-1.5 shrink-0 bg-main/50" />

          <h3 className={`font-bold ${level === 1 ? "text-base" : "text-sm"}`}>
            {category.title}
          </h3>
        </div>

        <span className="shrink-0 text-xs text-muted-foreground">
          {category.totalProductsCount} منتج
        </span>
      </div>

      {visibleChildren.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {visibleChildren.map((child) => (
            <Button
              key={child.id}
              type="button"
              size="xs"
              variant="ghost"
              color="MAIN"
              onClick={() => scrollToCategory(child.id)}
            >
              {child.title} ({child.totalProductsCount})
            </Button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-5">
        {category.products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {visibleChildren.map((child) => (
          <CategorySubSection
            key={child.id}
            category={child}
            level={level + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySubSection;
