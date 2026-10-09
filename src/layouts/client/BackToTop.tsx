"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [progress, setProgress] = useState(0);
  const scrollFrame = useRef<number | null>(null);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const remainingScroll = scrollableHeight - window.scrollY;
        const nextProgress =
          scrollableHeight > 0
            ? remainingScroll <= 1
              ? 100
              : Math.min(
                  100,
                  Math.max(0, (window.scrollY / scrollableHeight) * 100),
                )
            : 0;

        setProgress(nextProgress);
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(frame);
      if (scrollFrame.current !== null) {
        cancelAnimationFrame(scrollFrame.current);
      }
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      resizeObserver.disconnect();
    };
  }, []);

  const isVisible = progress > 10;
  const isComplete = progress >= 100;

  const scrollToTop = () => {
    if (scrollFrame.current !== null) {
      cancelAnimationFrame(scrollFrame.current);
    }

    const startPosition = window.scrollY;
    const startTime = performance.now();
    const duration = Math.min(1200, Math.max(500, startPosition * 0.35));
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const time = Math.min(elapsed / duration, 1);
      const easedTime = 1 - (1 - time) ** 3;

      window.scrollTo({
        top: startPosition * (1 - easedTime),
        behavior: "instant",
      });

      if (time < 1) {
        scrollFrame.current = requestAnimationFrame(animate);
      } else {
        scrollFrame.current = null;
      }
    };

    scrollFrame.current = requestAnimationFrame(animate);
  };

  return (
    <button
      type="button"
      aria-label="العودة إلى أعلى الصفحة"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={scrollToTop}
      className={`fixed bottom-20 left-4 z-40 flex size-10 cursor-pointer appearance-none items-center justify-center border-0 bg-background/70 p-0 text-foreground shadow-none outline-none ring-0 backdrop-blur-sm transition-[opacity,transform,color] duration-300 ease-out hover:text-main focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 motion-reduce:transition-none lg:bottom-6 lg:left-6 lg:size-12 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect
          x="0.75"
          y="0.75"
          width="46.5"
          height="46.5"
          pathLength="100"
          stroke="var(--color-main)"
          strokeDasharray={isComplete ? "none" : "100"}
          strokeDashoffset={isComplete ? 0 : 100 - progress}
          strokeWidth="1.5"
        />
      </svg>
      <ArrowUp aria-hidden="true" className="size-4 lg:size-5" />
    </button>
  );
};

export default BackToTop;
