import Image from "next/image";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative flex min-h-[calc(100dvh-5rem)] items-center justify-center overflow-hidden bg-[#1B1512] px-6">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="animate-hero-glow-pulse size-105 rounded-full bg-[#B90A1A]/20 blur-3xl sm:size-140" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="animate-hero-glow-pulse-slow size-70 rounded-full bg-main/10 blur-3xl sm:size-96" />
      </div>

      <div className="relative text-center">
        <div style={{ animationDelay: "0ms" }} className="animate-hero-fade-up">
          <Image
            src="/logo-2.png"
            alt="شعار الطنطاوي"
            width={240}
            height={219}
            className="animate-hero-float mx-auto h-46 w-auto sm:h-50"
            priority
          />
        </div>

        <h1
          style={{ animationDelay: "150ms" }}
          className="animate-hero-fade-up mt-8 text-6xl font-black tracking-tight text-main-foreground sm:text-[108px] md:text-9xl"
        >
          الطنطاوي
        </h1>

        <div
          style={{ animationDelay: "300ms" }}
          className="animate-hero-fade-up mx-auto mt-6 h-0.75 w-14 rounded-full bg-main"
        />

        <p
          style={{ animationDelay: "400ms" }}
          className="animate-hero-fade-up mt-6 text-lg font-medium text-main-foreground/80 sm:text-xl"
        >
          جودة وطعم أصلي
        </p>

        <p
          style={{ animationDelay: "500ms" }}
          className="animate-hero-fade-up mt-1 text-sm font-semibold tracking-widest text-main sm:text-base"
        >
          رقم واحد في مصر
        </p>
      </div>

      <div className="animate-hero-scroll-bounce absolute bottom-8 left-1/2 -translate-x-1/2 text-main-foreground/50">
        <ChevronDown className="size-7" />
      </div>
    </section>
  );
};

export default Hero;
