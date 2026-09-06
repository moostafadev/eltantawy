import { ClipboardList } from "lucide-react";

import { toArabicNums } from "@/utils/toArabicNums";

import { orderSteps } from "./constants";

const HowToOrder = () => {
  return (
    <section className="bg-background-second/20 py-15 md:py-20">
      <div className="container flex flex-col gap-10 lg:gap-14">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center bg-main/10 text-main">
            <ClipboardList className="size-6" strokeWidth={1.75} />
          </div>

          <span className="mb-2 text-sm font-medium tracking-wider text-main">
            اطلب بسهولة
          </span>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            كيف تطلب؟
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
            خطوات بسيطة وسريعة تفصلك عن استلام طلبك.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {orderSteps.map(({ title, desc, icon: Icon }, index) => (
            <div
              key={title}
              className="relative flex flex-col items-center gap-3 border border-background-second/60 bg-background p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="absolute -top-3 right-3 flex size-7 items-center justify-center bg-main text-xs font-bold text-main-foreground">
                {toArabicNums(index + 1)}
              </span>

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

export default HowToOrder;
