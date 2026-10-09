"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/button";
import { Tooltip } from "@/components/tooltip";

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
        <Tooltip content="العناصر السابقة" focusable={false}>
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
        </Tooltip>
      )}

      <CarouselProgress currentIndex={currentIndex} totalMoves={totalMoves} />

      {showArrows && (
        <Tooltip content="العناصر التالية" focusable={false}>
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
        </Tooltip>
      )}
    </div>
  );
};

export default CarouselControls;
