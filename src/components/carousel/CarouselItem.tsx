"use client";

import { CarouselItemProps } from "./types";

const CarouselItem = ({ children, className = "" }: CarouselItemProps) => {
  return (
    <div
      className={`min-w-0 shrink-0 flex-[0_0_calc((100%-0.75rem)/2)] lg:flex-[0_0_calc((100%-2rem)/3)] xl:flex-[0_0_calc((100%-3rem)/4)] ${className}`}
    >
      {children}
    </div>
  );
};

export default CarouselItem;
