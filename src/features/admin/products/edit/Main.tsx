import { memo } from "react";

import { CategoryGraph } from "@/features/admin/categories/create/Graph";
import { IProps } from "./types";
import { EditProductForm } from "./form";

const Edit = ({ product, categories }: IProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      <EditProductForm product={product} categories={categories} />

      <CategoryGraph
        categories={categories}
        selectedId={product.categoryId ?? undefined}
      />
    </div>
  );
};

export default memo(Edit);
