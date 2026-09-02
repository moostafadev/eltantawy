"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { toLogicalScrollLeft, toNativeScrollLeft } from "./rtlScroll";

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

  // بنستخدمهم عشان نتجاهل حدث الـ scroll الجاي من كود عندنا (زرار/أوتوبلاي)
  // ونستنى بس الـ scroll الجاي فعليًا من سحب المستخدم يدويًا.
  const isProgrammaticScroll = useRef(false);
  const programmaticScrollTimeout = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const scrollDebounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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

  /**
   * مسافة عنصر واحد (عرض العنصر + الفراغ بينه وبين اللي بعده).
   * كل العناصر بنفس العرض (flex-basis ثابتة)، فالاعتماد على أول عنصر كافي.
   */
  const getItemStep = useCallback((container: HTMLElement) => {
    const items = Array.from(container.children) as HTMLElement[];

    const firstItem = items[0];

    if (!firstItem) return 0;

    const styles = getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");

    return firstItem.getBoundingClientRect().width + gap;
  }, []);

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

      const step = getItemStep(container);

      // بنحسب موضع مطلق (مش نسبي) عشان نتفادى تراكم الأخطاء
      // لو المستخدم ضغط زرار قبل ما الأنيميشن اللي قبله يخلص.
      const targetLogicalOffset = nextIndex * step;

      isProgrammaticScroll.current = true;

      if (programmaticScrollTimeout.current) {
        clearTimeout(programmaticScrollTimeout.current);
      }

      container.scrollTo({
        left: toNativeScrollLeft(container, targetLogicalOffset),
        behavior: "smooth",
      });

      // fallback للمتصفحات اللي مش بتدعم حدث "scrollend"
      programmaticScrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 600);

      setCurrentIndex(nextIndex);
    },
    [containerRef, currentIndex, visibleItems, loop, getItemStep],
  );

  const scrollNext = useCallback(() => {
    if (currentIndex >= maxIndex && !loop) return;

    scrollToIndex(currentIndex + 1);
  }, [currentIndex, maxIndex, loop, scrollToIndex]);

  const scrollPrevious = useCallback(() => {
    if (currentIndex <= 0 && !loop) return;

    scrollToIndex(currentIndex - 1);
  }, [currentIndex, loop, scrollToIndex]);

  /*
   * تتبّع سحب المستخدم اليدوي (touch/trackpad) وتحديث currentIndex
   * تبعًا لموضع السكرول الفعلي، مش بس تبعًا لضغط الأزرار أو الأوتوبلاي.
   */
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      // تجاهل الأحداث الناتجة عن سكرول برمجي (زرار/أوتوبلاي)
      if (isProgrammaticScroll.current) return;

      if (scrollDebounceTimeout.current) {
        clearTimeout(scrollDebounceTimeout.current);
      }

      scrollDebounceTimeout.current = setTimeout(() => {
        const step = getItemStep(container);

        if (!step) return;

        const logicalOffset = toLogicalScrollLeft(container);

        const nearestIndex = Math.round(logicalOffset / step);

        const max = Math.max(0, totalItems - visibleItems);

        setCurrentIndex(Math.max(0, Math.min(nearestIndex, max)));
      }, 120);
    };

    const handleScrollEnd = () => {
      isProgrammaticScroll.current = false;

      if (programmaticScrollTimeout.current) {
        clearTimeout(programmaticScrollTimeout.current);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    // "scrollend" مش مدعوم في كل المتصفحات (زي Safari القديم)،
    // لكن لو موجود بيدينا دقة أعلى؛ وإلا هنعتمد على الـ fallback timeout
    // الموجود جوه scrollToIndex.
    container.addEventListener("scrollend", handleScrollEnd);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("scrollend", handleScrollEnd);

      if (scrollDebounceTimeout.current) {
        clearTimeout(scrollDebounceTimeout.current);
      }

      if (programmaticScrollTimeout.current) {
        clearTimeout(programmaticScrollTimeout.current);
      }
    };
  }, [containerRef, getItemStep, totalItems, visibleItems]);

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
