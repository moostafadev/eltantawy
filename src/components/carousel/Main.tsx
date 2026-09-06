"use client";

import { useRef, useState } from "react";

import { useCarousel } from "./useCarousel";
import CarouselControls from "./CarouselControls";
import { CarouselProps } from "./types";

const Carousel = ({
  children,
  showArrows = true,
  className = "",
  autoPlay = false,
  autoPlayInterval = 4000,
  pauseOnHover = true,
  loop = false,
}: CarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isHovering, setIsHovering] = useState(false);

  const {
    currentIndex,
    totalItems,
    totalMoves,
    visibleItems,
    scrollNext,
    scrollPrevious,
    canScrollPrevious,
    canScrollNext,
  } = useCarousel({
    containerRef,
    children,
    loop,
    autoPlay,
    autoPlayInterval,
    pauseOnHover,
    isHovering,
  });

  const hasOverflow = totalItems > visibleItems;

  return (
    <div
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={containerRef}
        dir="rtl"
        className="flex w-full gap-3 overflow-x-auto scroll-smooth py-1 [&::-webkit-scrollbar]:hidden lg:gap-4"
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>

      {hasOverflow && (
        <CarouselControls
          showArrows={showArrows}
          canScrollPrevious={canScrollPrevious}
          canScrollNext={canScrollNext}
          onPrevious={scrollPrevious}
          onNext={scrollNext}
          currentIndex={currentIndex}
          totalMoves={totalMoves}
        />
      )}
    </div>
  );
};

export default Carousel;
