import { Breadcrumb } from "@/components/breadcrumb";
import { Edit } from "@/features/admin/products/edit";
import { getCategoriesForGraph } from "@/features/admin/categories/table";
import { getOneProduct } from "@/features/admin/products/table";

interface EditProductProps {
  params: Promise<{
    id: string;
  }>;
}

const EditProduct = async ({ params }: EditProductProps) => {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getOneProduct(id),
    getCategoriesForGraph(),
  ]);

  if (!product) {
    return (
      <div className="flex flex-col gap-3 lg:gap-4">
        <p className="text-sm text-muted-foreground">المنتج غير موجود</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <Breadcrumb
        items={[
          {
            label: "المنتجات",
            href: "/admin/products",
          },
          {
            label: product.title,
            href: `/admin/products/${product.id}`,
          },
          {
            label: "تعديل",
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">تعديل المنتج</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          تعديل بيانات المنتج
        </p>
      </div>

      <Edit product={product} categories={categories} />
    </div>
  );
};

export default EditProduct;
