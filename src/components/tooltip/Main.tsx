"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { TooltipProps, TooltipSide } from "./types";

interface Position {
  top: number;
  left: number;
}

const arrowPositions: Record<Exclude<TooltipSide, "auto">, string> = {
  top: "left-1/2 top-full -translate-x-1/2 -translate-y-1/2",
  right: "right-full top-1/2 -translate-y-1/2 translate-x-1/2",
  bottom: "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2",
  left: "left-full top-1/2 -translate-y-1/2 -translate-x-1/2",
};

type FixedTooltipSide = Exclude<TooltipSide, "auto">;

const oppositeSide: Record<FixedTooltipSide, FixedTooltipSide> = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right",
};

const Tooltip = ({
  children,
  content,
  side = "top",
  className = "",
  focusable = true,
}: TooltipProps) => {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openFrameRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [resolvedSide, setResolvedSide] = useState<FixedTooltipSide>(
    side === "auto" ? "top" : side,
  );

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (unmountTimeoutRef.current) {
      clearTimeout(unmountTimeoutRef.current);
      unmountTimeoutRef.current = null;
    }
    if (openFrameRef.current !== null) {
      cancelAnimationFrame(openFrameRef.current);
      openFrameRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current && !isFocusedRef.current) {
        setIsOpen(false);
        unmountTimeoutRef.current = setTimeout(() => {
          if (!isHoveredRef.current && !isFocusedRef.current) {
            setIsMounted(false);
          }
        }, 150);
      }
    }, 100);
  }, [cancelClose]);

  const open = useCallback(() => {
    cancelClose();
    setIsMounted(true);
    openFrameRef.current = requestAnimationFrame(() => {
      openFrameRef.current = null;
      if (isHoveredRef.current || isFocusedRef.current) {
        setIsOpen(true);
      }
    });
  }, [cancelClose]);

  useLayoutEffect(() => {
    if (!isMounted) return;

    const updatePosition = () => {
      const trigger =
        triggerRef.current?.firstElementChild?.getBoundingClientRect() ??
        triggerRef.current?.getBoundingClientRect();
      const tooltip = tooltipRef.current?.getBoundingClientRect();

      if (!trigger || !tooltip) return;

      const gap = 8;
      const availableSpace: Record<FixedTooltipSide, number> = {
        top: trigger.top,
        right: window.innerWidth - trigger.right,
        bottom: window.innerHeight - trigger.bottom,
        left: trigger.left,
      };

      const preferredSide =
        side === "auto"
          ? availableSpace.top >= availableSpace.bottom
            ? "top"
            : "bottom"
          : side;
      const requiredSpace =
        preferredSide === "top" || preferredSide === "bottom"
          ? tooltip.height + gap
          : tooltip.width + gap;
      const fallbackSide = oppositeSide[preferredSide];
      const resolved =
        availableSpace[preferredSide] < requiredSpace &&
        availableSpace[fallbackSide] > availableSpace[preferredSide]
          ? fallbackSide
          : preferredSide;

      let top = trigger.top + (trigger.height - tooltip.height) / 2;
      let left = trigger.left + (trigger.width - tooltip.width) / 2;

      if (resolved === "top") top = trigger.top - tooltip.height - gap;
      if (resolved === "right") left = trigger.right + gap;
      if (resolved === "bottom") top = trigger.bottom + gap;
      if (resolved === "left") left = trigger.left - tooltip.width - gap;

      setResolvedSide(resolved);
      setPosition({
        top: Math.max(
          8,
          Math.min(top, window.innerHeight - tooltip.height - 8),
        ),
        left: Math.max(
          8,
          Math.min(left, window.innerWidth - tooltip.width - 8),
        ),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isMounted, side]);

  useLayoutEffect(
    () => () => {
      cancelClose();
    },
    [cancelClose],
  );

  return (
    <>
      <span
        ref={triggerRef}
        tabIndex={focusable ? 0 : -1}
        role={focusable ? "img" : undefined}
        aria-label={
          focusable && typeof content === "string" ? content : undefined
        }
        aria-describedby={focusable && isOpen ? tooltipId : undefined}
        className={
          focusable
            ? "group/tooltip relative inline-flex w-fit items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/50"
            : "contents"
        }
        onMouseEnter={() => {
          isHoveredRef.current = true;
          open();
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          scheduleClose();
        }}
        onFocus={() => {
          isFocusedRef.current = true;
          open();
        }}
        onBlur={() => {
          isFocusedRef.current = false;
          scheduleClose();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            isHoveredRef.current = false;
            isFocusedRef.current = false;
            cancelClose();
            setIsOpen(false);
            unmountTimeoutRef.current = setTimeout(() => {
              setIsMounted(false);
            }, 150);
          }
        }}
      >
        {children}
      </span>

      {isMounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            aria-hidden={!isOpen}
            style={{
              position: "fixed",
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              visibility: position ? "visible" : "hidden",
            }}
            className={`z-9999 max-w-64 border border-foreground/10 bg-foreground px-2.5 py-1.5 text-center text-xs font-medium text-background shadow-md transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none motion-reduce:duration-0 ${isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"} ${className}`}
            onMouseEnter={() => {
              isHoveredRef.current = true;
              open();
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
              scheduleClose();
            }}
          >
            {content}
            <span
              aria-hidden="true"
              className={`absolute size-2 rotate-45 bg-foreground ${arrowPositions[resolvedSide]}`}
            />
          </div>,
          document.body,
        )}
    </>
  );
};

export default Tooltip;
