import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Info,
  LayoutGrid,
  Package,
  ShieldCheck,
  Truck,
  Sprout,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/button";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/features/client/product-card";
import { Carousel, CarouselItem } from "@/components/carousel";
import { getHomeCategories } from "@/features/client/categories";

const Page = async () => {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
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
    }),
    getHomeCategories(6),
  ]);

  const aboutFeatures = [
    {
      title: "مزارعنا الخاصة",
      desc: "منتجاتنا مصدرها مزارعنا المصرية الخاصة مباشرة، بدون وسطاء، لضمان جودة وطعم أصلي.",
      icon: Sprout,
    },
    {
      title: "جودة وسلامة غذائية",
      desc: "نلتزم بأعلى معايير السلامة الغذائية في كل مراحل الاختيار والتجهيز والتوريد.",
      icon: ShieldCheck,
    },
    {
      title: "طازج دايمًا",
      desc: "منتجات طازجة يوميًا، محضّرة بعناية فائقة لتصل إليك بأفضل حالة ممكنة.",
      icon: Sparkles,
    },
    {
      title: "توصيل مخصص لمنطقتك",
      desc: "التوصيل متاح حاليًا في 6 أكتوبر والشيخ زايد فقط، حفاظًا على تجميد المنتجات وجودتها حتى تصل إليك.",
      icon: Truck,
    },
  ];

  const aboutStats = [
    { value: "100%", label: "مزارع مصرية خاصة" },
    { value: "٢", label: "منطقة توصيل حاليًا" },
    { value: "٠٪", label: "وسطاء بين المزرعة وطبقك" },
  ];

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
      <section className="bg-background-second/20 py-15 md:py-20">
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

      {/* Categories */}
      {categories.length > 0 && (
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
      )}

      {/* About Us */}
      <section className="bg-background-second/20 py-15 md:py-20">
        <div className="container flex flex-col gap-10 lg:gap-14">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center bg-main/10 text-main">
              <Info className="size-6" strokeWidth={1.75} />
            </div>

            <span className="mb-2 text-sm font-medium tracking-wider text-main">
              من نحن
            </span>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              الطنطاوي.. جودة وطعم أصلي في كل قطعة
            </h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Text */}
            <div className="flex flex-col gap-4 text-center lg:text-right">
              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                الطنطاوي علامة مصرية متخصصة في اللحوم والدواجن، نعتمد على
                مزارعنا الخاصة لتوفير منتجات طازجة يوميًا بجودة عالية وأسعار
                عادلة، مع الالتزام الكامل بمعايير الصحة والسلامة الغذائية في كل
                خطوة، من المزرعة وحتى وصول طلبك إليك.
              </p>

              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                نبدأ حاليًا بخدمة عملائنا في 6 أكتوبر والشيخ زايد، لضمان بقاء
                منتجاتنا مجمّدة بالكامل طوال رحلة التوصيل، ونعمل على التوسع
                لمناطق جديدة قريبًا.
              </p>

              <div className="mx-auto mt-2 grid w-fit grid-cols-3 gap-6 border-t border-background-second/60 pt-5 lg:mx-0">
                {aboutStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-1 lg:items-start"
                  >
                    <span className="text-2xl font-bold text-main">
                      {stat.value}
                    </span>

                    <span className="max-w-24 text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative order-first aspect-4/3 w-full overflow-hidden border border-background-second/60 bg-background shadow-sm lg:order-last">
              <Image
                src="/logo-alt.png"
                alt="الطنطاوي"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-10"
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {aboutFeatures.map(({ title, desc, icon: Icon }) => (
              <div
                key={title}
                className="flex flex-col items-center gap-3 border border-background-second/60 bg-background p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center bg-main/10 text-main">
                  <Icon className="size-6" strokeWidth={1.75} />
                </div>

                <h3 className="font-bold">{title}</h3>

                <p className="text-sm leading-6 text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
