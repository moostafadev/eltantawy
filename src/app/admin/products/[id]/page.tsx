import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { CategoryGraph } from "@/features/admin/categories/create/Graph";
import { getCategoriesForGraph } from "@/features/admin/categories/table";
import { getOneProduct } from "@/features/admin/products/table";

interface ProductProps {
  params: Promise<{
    id: string;
  }>;
}

const Product = async ({ params }: ProductProps) => {
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
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            تفاصيل المنتج وإدارته
          </p>
        </div>

        <Link
          href={`/admin/products/${product.id}/edit`}
          className="mr-auto self-end"
        >
          <Button color="INFO" size="sm" variant="soft">
            <Pencil className="size-4" />
            <span>تعديل المنتج</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-4">
        {/* Product Details */}
        <section className="overflow-hidden border border-background-second bg-background shadow-sm">
          <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
            <h2 className="text-sm font-semibold">بيانات المنتج</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              المعلومات الأساسية الخاصة بالمنتج
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <ProductItem label="اسم المنتج" value={product.title} />

            <ProductItem
              label="التصنيف"
              value={product.category?.title ?? "بدون تصنيف"}
            />

            <ProductItem label="السعر" value={`${product.price} جنيه`} />

            <ProductItem
              label="سعر الخصم"
              value={
                product.discountPrice
                  ? `${product.discountPrice} جنيه`
                  : "لا يوجد"
              }
            />

            <ProductItem
              label="الوحدة"
              value={product.unit === "KG" ? "كيلوجرام" : "قطعة"}
            />

            <ProductItem
              label="نوع البيع"
              value={product.saleType === "WEIGHT_RANGE" ? "نطاق وزن" : "عادي"}
            />

            <ProductItem
              label="تاريخ الإنشاء"
              value={new Date(product.createdAt).toLocaleDateString("ar-EG")}
            />

            <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 sm:col-span-2 lg:gap-1.5 lg:p-4">
              <p className="text-xs font-medium text-muted-foreground">الوصف</p>

              <p className="text-sm font-medium leading-6 text-foreground">
                {product.desc || "لا يوجد وصف للمنتج"}
              </p>
            </div>

            {product.saleType === "WEIGHT_RANGE" && (
              <div className="flex flex-col gap-2 border-b border-background-second/60 p-3 sm:col-span-2 lg:gap-2.5 lg:p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  خيارات الوزن
                </p>

                {product.weightOptions.length === 0 ? (
                  <p className="text-sm font-medium text-foreground">
                    لا توجد خيارات وزن
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {product.weightOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex flex-wrap items-center justify-between gap-2 border border-background-second/60 p-2"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {option.name}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          من {option.minWeight} كجم إلى {option.maxWeight} كجم
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Product Image */}
        <section className="overflow-hidden border border-background-second bg-background shadow-sm">
          <div className="border-b border-background-second bg-muted/30 p-3 lg:p-4">
            <h2 className="text-sm font-semibold">صورة المنتج</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              الصورة المستخدمة لعرض المنتج
            </p>
          </div>

          <div className="flex min-h-64 items-center justify-center p-4 lg:min-h-full lg:p-6">
            {product.image ? (
              <div className="relative size-full min-h-56">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 384px"
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex size-full min-h-56 items-center justify-center bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  لا توجد صورة للمنتج
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Category Graph */}
      {product.categoryId && (
        <CategoryGraph
          categories={categories}
          selectedId={product.categoryId}
        />
      )}
    </div>
  );
};

interface ProductItemProps {
  label: string;
  value: string;
}

const ProductItem = ({ label, value }: ProductItemProps) => {
  return (
    <div className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

export default Product;
