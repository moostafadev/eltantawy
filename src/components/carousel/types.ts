import { ReactNode } from "react";

export interface CarouselProps {
  children: ReactNode;
  showArrows?: boolean;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
}

export interface CarouselItemProps {
  children: ReactNode;
  className?: string;
}
