export interface Category {
  id: string;
  title: string;
  desc: string | null;
  image: string | null;
  parentId: string | null;
}

export interface CategoryOption {
  id: string;
  title: string;
  parentId: string | null;
  _count: {
    products: number;
  };
}

export interface IProps {
  category: Category;
  categories: CategoryOption[];
}
