import Image from "next/image";

const Page = () => {
  return (
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
  );
};
export default Page;
