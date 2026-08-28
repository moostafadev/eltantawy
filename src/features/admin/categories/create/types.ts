import { z } from "zod";

import { createCategorySchema } from "./form/schema";

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

interface ICategoryParent {
  id: string;
  title: string;
  parentId: string | null;
  _count: {
    products: number;
    children: number;
  };
}

interface IProps {
  categories: ICategoryParent[];
}

interface ICategoryCreateContextValue {
  selectedParentId: string;
  setSelectedParentId: (id: string) => void;
}

interface IPropsStore {
  children: React.ReactNode;
}

interface ICategoryCreateState {
  selectedParentId: string;
}

interface ICategoryCreateActions {
  setSelectedParentId: (id: string) => void;
}

export type {
  ICategoryParent,
  IProps,
  CreateCategoryFormValues,
  ICategoryCreateContextValue,
  IPropsStore,
  ICategoryCreateState,
  ICategoryCreateActions,
};
