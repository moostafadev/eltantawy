import { CategoryParent } from "../create/Graph/types";

export interface Category {
  id: string;
  title: string;
  desc: string | null;
  image: string | null;
  parentId: string | null;
}

export interface IProps {
  category: Category;
  categories: CategoryParent[];
}
