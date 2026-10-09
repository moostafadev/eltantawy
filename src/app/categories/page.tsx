import {
  Categories,
  getCategoriesForStore,
} from "@/features/client/categories";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "التصنيفات",
  description:
    "تصفّح أقسام اللحوم والدواجن لدى الطنطاوي، واعثر بسهولة على المنتجات والأسعار المناسبة لك.",
  path: "/categories",
});

const CategoriesPage = async () => {
  const categories = await getCategoriesForStore();

  return <Categories categories={categories} />;
};

export default CategoriesPage;
