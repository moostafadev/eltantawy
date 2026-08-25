import { memo } from "react";

import { CreateCategoryForm } from "./form";
import { CategoryGraph } from "./Graph";
import { CategoryCreateProvider } from "./store";
import { IProps } from "./types";

const Create = ({ categories }: IProps) => {
  return (
    <CategoryCreateProvider>
      <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
        <CreateCategoryForm categories={categories} />

        <CategoryGraph categories={categories} />
      </div>
    </CategoryCreateProvider>
  );
};

export default memo(Create);
