import { getOneCategory } from "@/features/admin/categories/table/categories.service";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { id } = await params;

  const category = await getOneCategory(id);

  if (!category) {
    return (
      <div className="container py-6">
        <p className="text-sm text-muted-foreground">التصنيف غير موجود</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-xl font-bold">{category.title}</h1>
    </div>
  );
};

export default CategoryPage;
