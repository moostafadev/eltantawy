import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import type { Metadata } from "next";

import { Breadcrumb } from "@/components/breadcrumb";
import { StructuredData } from "@/components/structured-data";
import { ProductCard } from "@/features/client/product-card";
import ProductPrice from "@/features/client/product-card/ProductPrice";
import {
  getProductForStore,
  getRelatedProducts,
  ProductDetailPurchase,
} from "@/features/client/products";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbStructuredData,
  buildProductStructuredData,
} from "@/lib/seo/structuredData";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: ProductPageProps): Promise<Metadata> => {
  const { id } = await params;

  const product = await getProductForStore(id);

  if (!product) {
    return buildMetadata({
      title: "المنتج غير موجود",
      description: "المنتج المطلوب غير متوفر حاليًا.",
      path: `/products/${id}`,
      noIndex: true,
    });
  }

  const description =
    product.desc ||
    `اشتري ${product.title} الطازج من الطنطاوي بأفضل سعر وجودة عالية، مع توصيل سريع لمنطقتك.`;

  return buildMetadata({
    title: product.title,
    description,
    path: `/products/${product.id}`,
    image: product.image ?? undefined,
    keywords: [product.title, product.category?.title ?? ""].filter(Boolean),
  });
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;

  const product = await getProductForStore(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id,
  );

  const unitLabel = product.unit === "KG" ? "كيلو" : "قطعة";

  const structuredData = [
    buildProductStructuredData({
      id: product.id,
      title: product.title,
      description: product.desc,
      image: product.image,
      price: product.price,
      discountPrice: product.discountPrice,
      unit: product.unit,
      categoryTitle: product.category?.title,
    }),
    buildBreadcrumbStructuredData([
      { name: "المنتجات", path: "/products" },
      ...(product.category
        ? [{ name: product.category.title, path: "/categories" }]
        : []),
      { name: product.title, path: `/products/${product.id}` },
    ]),
  ];

  return (
    <main className="container flex flex-col gap-6 py-6 lg:gap-8 lg:py-8">
      <StructuredData data={structuredData} />

      <Breadcrumb
        items={[
          {
            label: "المنتجات",
            href: "/products",
          },
          ...(product.category
            ? [
                {
                  label: product.category.title,
                  href: "/categories",
                },
              ]
            : []),
          {
            label: product.title,
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden border border-background-second/60 bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-main/60">
              <Package className="size-20" />
            </div>
          )}

          {product.discountPrice !== null &&
            product.discountPrice < product.price && (
              <span className="absolute right-3 top-3 bg-main px-3 py-1 text-sm font-semibold text-main-foreground">
                خصم
              </span>
            )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            {product.category && (
              <Link
                href="/categories"
                className="w-fit text-xs font-medium text-main hover:underline"
              >
                {product.category.title}
              </Link>
            )}

            <h1 className="text-2xl font-bold lg:text-3xl">{product.title}</h1>

            <span className="text-sm text-muted-foreground">{unitLabel}</span>
          </div>

          <ProductPrice
            price={product.price}
            discountPrice={product.discountPrice}
          />

          {product.desc && (
            <p className="leading-7 text-muted-foreground">{product.desc}</p>
          )}

          <div className="border-t border-background-second/60 pt-4">
            <ProductDetailPurchase
              productId={product.id}
              price={product.price}
              discountPrice={product.discountPrice}
              unit={product.unit}
              saleType={product.saleType}
              weightOptions={product.weightOptions}
            />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="flex flex-col gap-4 border-t border-background-second/60 pt-6 lg:pt-8">
          <h2 className="text-xl font-bold">منتجات مشابهة</h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductPage;
