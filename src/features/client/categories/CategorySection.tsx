"use client";

import { Package } from "lucide-react";

import { Button } from "@/components/button";

import CategorySubSection from "./CategorySubSection";
import type { getCategoriesForStore } from "./category.service";
import { ProductCard } from "../product-card";

type CategoryNode = Awaited<ReturnType<typeof getCategoriesForStore>>[number];

interface CategorySectionProps {
  category: CategoryNode;
}

const scrollToCategory = (id: string) => {
  document
    .getElementById(`category-${id}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const CategorySection = ({ category }: CategorySectionProps) => {
  if (category.totalProductsCount === 0) return null;

  const visibleChildren = category.children.filter(
    (child) => child.totalProductsCount > 0,
  );

  return (
    <section
      id={`category-${category.id}`}
      className="scroll-mt-16 lg:scroll-mt-36"
    >
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-border pb-3 lg:mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center bg-main/10 text-main lg:size-10">
            <Package className="size-4.5 lg:size-5" />
          </div>

          <h2 className="text-lg font-bold lg:text-xl">{category.title}</h2>
        </div>

        <span className="shrink-0 text-xs text-muted-foreground lg:text-sm">
          {category.totalProductsCount} منتج
        </span>
      </div>

      {visibleChildren.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {visibleChildren.map((child) => (
            <Button
              key={child.id}
              type="button"
              size="xs"
              variant="soft"
              color="MAIN"
              onClick={() => scrollToCategory(child.id)}
            >
              {child.title} ({child.totalProductsCount})
            </Button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:gap-8">
        {category.products.length > 0 && (
          <div>
            {visibleChildren.length > 0 && (
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span className="size-1.5 bg-main/50" />
                منتجات عامة
              </h3>
            )}

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {visibleChildren.map((child) => (
          <CategorySubSection key={child.id} category={child} level={1} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
