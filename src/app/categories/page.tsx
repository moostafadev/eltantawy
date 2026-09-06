import {
  Categories,
  getCategoriesForStore,
} from "@/features/client/categories";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "التصنيفات",
  description:
    "تصفح تصنيفات منتجات الطنطاوي من اللحوم والدواجن، كل تصنيف يحتوي على أفضل المنتجات الطازجة المختارة بعناية.",
  path: "/categories",
});

const CategoriesPage = async () => {
  const categories = await getCategoriesForStore();

  return <Categories categories={categories} />;
};

export default CategoriesPage;
