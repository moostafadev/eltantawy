import {
  Categories,
  getCategoriesForStore,
} from "@/features/client/categories";

const CategoriesPage = async () => {
  const categories = await getCategoriesForStore();

  return <Categories categories={categories} />;
};

export default CategoriesPage;
