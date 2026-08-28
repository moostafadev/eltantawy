import { memo } from "react";

import { CreateProductForm } from "./form";
import { CategoryGraph } from "@/features/admin/categories/create/Graph";
import { CategoryCreateProvider } from "@/features/admin/categories/create/store";
import { IProps } from "./types";

const Create = ({ categories }: IProps) => {
  return (
    <CategoryCreateProvider>
      <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
        <CreateProductForm categories={categories} />

        <CategoryGraph categories={categories} />
      </div>
    </CategoryCreateProvider>
  );
};

export default memo(Create);
