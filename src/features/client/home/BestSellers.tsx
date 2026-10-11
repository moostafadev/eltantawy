import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";

import { Carousel, CarouselItem } from "@/components/carousel";
import { ProductCard } from "@/features/client/product-card";

import { getTopSellingProducts } from "./home.service";

const BestSellers = async () => {
  const bestSellers = await getTopSellingProducts(8);

  return (
    <section
      className="bg-background-second/20 py-15 md:py-20"
      id="best-sellers"
    >
      <div className="container flex flex-col gap-8 lg:gap-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center bg-main/10 text-main">
            <TrendingUp className="size-6" strokeWidth={1.75} />
          </div>

          <span className="mb-2 text-sm font-medium tracking-wider text-main">
            اختيارات عملائنا
          </span>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            الأكثر مبيعًا
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
            اكتشف أفضل منتجاتنا المختارة بعناية لضمان أعلى جودة وطعم مميز.
          </p>
        </div>

        <Carousel>
          {bestSellers.map((product) => (
            <CarouselItem key={product.id}>
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </Carousel>

        <Link
          href="/products"
          className="mx-auto inline-flex items-center gap-1 text-sm font-medium text-main transition-colors hover:text-main/80 focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4"
        >
          تصفّح كل المنتجات
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default BestSellers;
