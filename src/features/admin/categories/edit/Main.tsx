import { memo } from "react";

import { EditCategoryForm } from "./form";
import { CategoryGraph } from "../create/Graph";
import { IProps } from "./types";

const Edit = ({ category, categories }: IProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      <EditCategoryForm category={category} categories={categories} />

      <CategoryGraph categories={categories} selectedId={category.id} />
    </div>
  );
};

export default memo(Edit);
