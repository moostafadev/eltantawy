import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/button";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/features/client/product-card";
import { Carousel, CarouselItem } from "@/components/carousel";

const Page = async () => {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
    select: {
      id: true,
      title: true,
      image: true,
      price: true,
      discountPrice: true,
      unit: true,
      weightOptions: true,
      saleType: true,
    },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[calc(100dvh-5rem)] items-center justify-center overflow-hidden bg-[#1B1512] px-6">
        <style>
          {`
            @keyframes glow-pulse {
              0%, 100% {
                opacity: 0.55;
                transform: scale(1);
              }

              50% {
                opacity: 0.9;
                transform: scale(1.2);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .glow {
                animation: none;
              }
            }
          `}
        </style>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="glow size-105 rounded-full bg-[#B90A1A]/20 blur-3xl animate-[glow-pulse_4s_ease-in-out_infinite] sm:size-140" />
        </div>

        <div className="relative text-center">
          <Image
            src="/logo-2.png"
            alt="شعار الطنطاوي"
            width={240}
            height={219}
            className="mx-auto h-46 w-auto sm:h-50"
            priority
          />

          <h1 className="mt-8 text-6xl font-black tracking-tight text-main-foreground sm:text-[108px] md:text-9xl">
            الطنطاوي
          </h1>

          <div className="mx-auto mt-6 h-0.75 w-14 rounded-full bg-main" />

          <p className="mt-6 text-lg font-medium text-main-foreground/80 sm:text-xl">
            جودة وطعم أصلي
          </p>

          <p className="mt-1 text-sm font-semibold tracking-widest text-main sm:text-base">
            رقم واحد في مصر
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-15 md:py-20">
        <div className="container flex flex-col gap-8 lg:gap-10">
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 text-sm font-medium tracking-wider text-main">
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
            {products.map((product) => (
              <CarouselItem key={product.id}>
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </Carousel>

          <Link href="/products" className="mx-auto">
            <Button size="sm" variant="ghost">
              عرض جميع المنتجات
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Page;
