"use client";

import { Button } from "@/components/button";

import type { getCategoriesForStore } from "./category.service";

type CategoryNode = Awaited<ReturnType<typeof getCategoriesForStore>>[number];

interface CategoriesQuickNavProps {
  categories: CategoryNode[];
}

const CategoriesQuickNav = ({ categories }: CategoriesQuickNavProps) => {
  const scrollToCategory = (id: string) => {
    document
      .getElementById(`category-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-0 z-20 border-y border-background-second/20 bg-background/50 backdrop-blur-sm lg:top-16 shadow-sm">
      <div className="container">
        <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              type="button"
              size="sm"
              color="MAIN"
              className="shrink-0 whitespace-nowrap"
              onClick={() => scrollToCategory(category.id)}
            >
              {category.title}

              <span className="text-xs">({category.totalProductsCount})</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesQuickNav;
