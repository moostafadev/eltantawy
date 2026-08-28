import { z } from "zod";

import { createProductSchema } from "./form/schema";

export type CreateProductFormValues = z.infer<typeof createProductSchema>;

export interface ProductCategory {
  id: string;
  title: string;
  parentId: string | null;
}

export interface IProps {
  categories: ProductCategory[];
}

export interface IPropsStore {
  children: React.ReactNode;
}

export interface IProductCreateState {
  selectedCategoryId: string;
}

export interface IProductCreateActions {
  setSelectedCategoryId: (id: string) => void;
}
