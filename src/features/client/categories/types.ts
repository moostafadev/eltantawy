export interface Category {
  id: string;
  title: string;
  desc: string | null;
  image: string | null;
  parentId: string | null;
  productsCount: number;
  childrenCount: number;
}

export interface CategoriesResponse {
  categories: Category[];
}
