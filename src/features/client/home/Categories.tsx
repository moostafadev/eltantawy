import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Package } from "lucide-react";

import { getHomeCategories } from "@/features/client/categories";

const HomeCategories = async () => {
  const categories = await getHomeCategories(6);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-15 md:py-20">
      <div className="container flex flex-col gap-8 lg:gap-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center bg-main/10 text-main">
            <LayoutGrid className="size-6" strokeWidth={1.75} />
          </div>

          <span className="mb-2 text-sm font-medium tracking-wider text-main">
            تسوق حسب النوع
          </span>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            تصنيفاتنا
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
            اختر التصنيف اللي محتاجه ووصل بسرعة لأفضل المنتجات المناسبة لك.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories#category-${category.id}`}
              className="group relative flex aspect-video flex-col justify-end overflow-hidden border border-background-second/60 bg-muted shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-main/30 hover:shadow-lg sm:aspect-4/3 lg:aspect-16/10"
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-main/10 text-main">
                  <Package className="size-16" strokeWidth={1.25} />
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-main/0 via-transparent to-main/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Floating Arrow Button */}
              <div className="absolute left-4 top-4 flex size-10 -translate-x-2 scale-90 items-center justify-center border border-white/20 bg-main/60 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
                <ArrowLeft className="size-4" />
              </div>

              {/* Count Badge */}
              <div className="absolute right-4 top-4 flex items-center gap-1.5 border border-white/10 bg-black/30 px-2.5 py-1.5 text-white backdrop-blur-sm">
                <Package className="size-3.5 text-main" />
                <span className="text-xs font-semibold">
                  {category.totalProductsCount} منتج
                </span>
              </div>

              <div className="relative flex flex-col gap-1.5 p-5 text-white lg:p-6">
                <div className="h-0.5 w-8 bg-main transition-all duration-300 group-hover:w-14" />

                <h3 className="text-2xl font-bold leading-tight lg:text-3xl">
                  {category.title}
                </h3>

                <span className="text-sm font-medium text-white/70">
                  تسوّق أجود المنتجات الآن
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;
