import { Button } from "@/components/button";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <section className="relative flex min-h-[calc(100dvh-5rem)] items-center justify-center overflow-hidden bg-[#1B1512] px-6">
        <style>
          {`
          @keyframes glow-pulse {
            0%, 100% { opacity: 0.55; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.2); }
          }
          @media (prefers-reduced-motion: reduce) {
            .glow { animation: none; }
          }
        `}
        </style>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="glow h-105 w-105 rounded-full bg-[#B90A1A]/20 blur-3xl animate-[glow-pulse_4s_ease-in-out_infinite] sm:h-140 sm:w-140" />
        </div>

        <div className="relative text-center">
          <Image
            src="/logo-2.png"
            alt="شعار الطنطاوي"
            width={240}
            height={219}
            className="mx-auto h-40 w-auto sm:h-36"
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
      <section className="relative overflow-hidden py-15 md:py-20">
        <div className="container flex flex-col gap-10">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center">
            <span className="mb-3 text-sm font-medium tracking-wider text-main">
              اختيارات عملائنا
            </span>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              الأكثر مبيعًا
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              اكتشف أفضل قطع اللحوم التي يفضلها عملاؤنا، مختارة بعناية لضمان
              أعلى جودة وطعم مميز في كل وجبة.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "لحمة سمانة فاخرة",
                description: "لحمة جاموسي فاخرة طازجة من مزارع الطنطاوي",
                image: "/test.png",
              },
              {
                name: "لحمة سمانة فاخرة",
                description: "لحمة جاموسي فاخرة طازجة من مزارع الطنطاوي",
                image: "/test.png",
              },
              {
                name: "لحمة سمانة فاخرة",
                description: "لحمة جاموسي فاخرة طازجة من مزارع الطنطاوي",
                image: "/test.png",
              },
              {
                name: "لحمة سمانة فاخرة",
                description: "لحمة جاموسي فاخرة طازجة من مزارع الطنطاوي",
                image: "/test.png",
              },
            ].map((product, index) => (
              <article
                key={index}
                className="group relative overflow-hidden border border-main-foreground/10 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Bestseller Badge */}
                  <span className="absolute right-3 top-3 rounded-full bg-main px-3 py-1 text-xs font-semibold text-main-foreground shadow-sm">
                    الأكثر مبيعًا
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold md:text-xl">
                    {product.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {product.description}
                  </p>

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-main-foreground/10 pt-4">
                    <span className="text-sm font-medium text-main">
                      جودة مضمونة
                    </span>

                    <Button type="button" color="MAIN" size="sm">
                      عرض المنتج
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Link href={"/top-selling"} className="w-fit mx-auto">
            <Button size="sm">شاهد المزيد</Button>
          </Link>
        </div>
      </section>
    </>
  );
};
export default Page;
