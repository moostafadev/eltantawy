"use client";

import { useCallback, useEffect, useState } from "react";

interface UseCarouselProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  loop: boolean;
  autoPlay: boolean;
  autoPlayInterval: number;
  pauseOnHover: boolean;
  isHovering: boolean;
}

export const useCarousel = ({
  containerRef,
  children,
  loop,
  autoPlay,
  autoPlayInterval,
  pauseOnHover,
  isHovering,
}: UseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const maxIndex = Math.max(0, totalItems - visibleItems);
  const totalMoves = maxIndex + 1;

  const updateCarousel = useCallback(() => {
    const container = containerRef.current;

    if (!container) return;

    const items = Array.from(container.children) as HTMLElement[];

    if (!items.length) {
      setTotalItems(0);
      setVisibleItems(1);
      setCurrentIndex(0);
      return;
    }

    const firstItem = items[0];

    if (!firstItem) return;

    const containerWidth = container.clientWidth;
    const itemWidth = firstItem.getBoundingClientRect().width;

    const styles = getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");

    const visible = Math.max(
      1,
      Math.round((containerWidth + gap) / (itemWidth + gap)),
    );

    const nextMaxIndex = Math.max(0, items.length - visible);

    setTotalItems(items.length);
    setVisibleItems(visible);

    setCurrentIndex((previous) => Math.min(previous, nextMaxIndex));
  }, [containerRef]);

  useEffect(() => {
    updateCarousel();

    const container = containerRef.current;

    if (!container) return;

    const observer = new ResizeObserver(updateCarousel);

    observer.observe(container);

    return () => observer.disconnect();
  }, [updateCarousel]);

  useEffect(() => {
    const frame = requestAnimationFrame(updateCarousel);

    return () => cancelAnimationFrame(frame);
  }, [children, updateCarousel]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;

      if (!container) return;

      const items = Array.from(container.children) as HTMLElement[];

      if (!items.length) return;

      const max = Math.max(0, items.length - visibleItems);

      let nextIndex = index;

      if (loop) {
        if (index > max) {
          nextIndex = 0;
        } else if (index < 0) {
          nextIndex = max;
        }
      } else {
        nextIndex = Math.max(0, Math.min(index, max));
      }

      if (nextIndex === currentIndex) return;

      const currentItem = items[currentIndex];

      if (!currentItem) return;

      const styles = getComputedStyle(container);
      const gap = parseFloat(styles.columnGap || styles.gap || "0");

      const itemWidth = currentItem.getBoundingClientRect().width;
      const distance = itemWidth + gap;

      const isMovingNext = nextIndex > currentIndex;

      container.scrollBy({
        left: isMovingNext ? -distance : distance,
        behavior: "smooth",
      });

      setCurrentIndex(nextIndex);
    },
    [containerRef, currentIndex, visibleItems, loop],
  );

  const scrollNext = useCallback(() => {
    if (currentIndex >= maxIndex && !loop) return;

    scrollToIndex(currentIndex + 1);
  }, [currentIndex, maxIndex, loop, scrollToIndex]);

  const scrollPrevious = useCallback(() => {
    if (currentIndex <= 0 && !loop) return;

    scrollToIndex(currentIndex - 1);
  }, [currentIndex, loop, scrollToIndex]);

  useEffect(() => {
    if (!autoPlay) return;

    if (pauseOnHover && isHovering) return;

    if (totalItems <= visibleItems) return;

    const timer = setInterval(() => {
      if (currentIndex >= maxIndex) {
        if (loop) {
          scrollToIndex(0);
        }

        return;
      }

      scrollToIndex(currentIndex + 1);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [
    autoPlay,
    autoPlayInterval,
    pauseOnHover,
    isHovering,
    totalItems,
    visibleItems,
    currentIndex,
    maxIndex,
    loop,
    scrollToIndex,
  ]);

  return {
    currentIndex,
    visibleItems,
    totalItems,
    totalMoves,
    maxIndex,
    scrollNext,
    scrollPrevious,
    canScrollPrevious: loop || currentIndex > 0,
    canScrollNext: loop || currentIndex < maxIndex,
  };
};
