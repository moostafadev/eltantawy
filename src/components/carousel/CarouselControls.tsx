"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/button";

import CarouselProgress from "./CarouselProgress";

interface CarouselControlsProps {
  showArrows: boolean;
  canScrollPrevious: boolean;
  canScrollNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalMoves: number;
}

const CarouselControls = ({
  showArrows,
  canScrollPrevious,
  canScrollNext,
  onPrevious,
  onNext,
  currentIndex,
  totalMoves,
}: CarouselControlsProps) => {
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      {showArrows && (
        <Button
          type="button"
          variant="soft"
          color="SECONDARY"
          size="icon"
          onClick={onPrevious}
          disabled={!canScrollPrevious}
          aria-label="العناصر السابقة"
          className="size-8 shrink-0 rounded-full p-0"
        >
          <ChevronRight className="size-4" />
        </Button>
      )}

      <CarouselProgress currentIndex={currentIndex} totalMoves={totalMoves} />

      {showArrows && (
        <Button
          type="button"
          variant="soft"
          color="SECONDARY"
          size="icon"
          onClick={onNext}
          disabled={!canScrollNext}
          aria-label="العناصر التالية"
          className="size-8 shrink-0 rounded-full p-0"
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}
    </div>
  );
};

export default CarouselControls;
