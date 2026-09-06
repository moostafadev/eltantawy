import Image from "next/image";
import { Info } from "lucide-react";

import { aboutFeatures, aboutStats } from "./constants";

const AboutUs = () => {
  return (
    <section className="py-15 md:py-20">
      <div className="container flex flex-col gap-10 lg:gap-14">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center bg-main/10 text-main">
            <Info className="size-6" strokeWidth={1.75} />
          </div>

          <span className="mb-2 text-sm font-medium tracking-wider text-main">
            من نحن
          </span>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            الطنطاوي.. جودة وطعم أصلي
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Text */}
          <div className="flex flex-col gap-4 text-center lg:text-right">
            <p className="text-sm leading-7 text-muted-foreground md:text-base">
              الطنطاوي علامة مصرية متخصصة في اللحوم والدواجن، نعتمد على مزارعنا
              الخاصة لتوفير منتجات طازجة يوميًا بجودة عالية وأسعار عادلة، مع
              الالتزام الكامل بمعايير الصحة والسلامة الغذائية في كل خطوة، من
              المزرعة وحتى وصول طلبك إليك.
            </p>

            <p className="text-sm leading-7 text-muted-foreground md:text-base">
              نبدأ حاليًا بخدمة عملائنا في 6 أكتوبر والشيخ زايد، لضمان بقاء
              منتجاتنا مجمّدة بالكامل طوال رحلة التوصيل، ونعمل على التوسع لمناطق
              جديدة قريبًا.
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

              <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
