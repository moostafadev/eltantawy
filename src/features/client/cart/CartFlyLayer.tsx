"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { getCartTarget, onFlyToCart, notifyLanded } from "@/lib/cart/flyToCart";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const CartFlyLayer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    const unsubscribe = onFlyToCart(({ fromEl, imageSrc }) => {
      const target = getCartTarget();
      const container = containerRef.current;
      if (!target || !container) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = target.getBoundingClientRect();
      const size = 46;

      const startX = fromRect.left + fromRect.width / 2 - size / 2;
      const startY = fromRect.top + fromRect.height / 2 - size / 2;
      const endX = toRect.left + toRect.width / 2 - size / 2;
      const endY = toRect.top + toRect.height / 2 - size / 2;

      const midX = (startX + endX) / 2;
      const midY = Math.min(startY, endY) - 130;

      const clone = document.createElement("div");
      Object.assign(clone.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "9999px",
        overflow: "hidden",
        zIndex: "9999",
        pointerEvents: "none",
        boxShadow: "0 8px 20px rgba(0,0,0,0.28)",
        background: imageSrc ? "#fff" : "var(--color-main)",
        border:
          "2px solid color-mix(in srgb, var(--color-main) 30%, transparent)",
      } satisfies Partial<CSSStyleDeclaration>);

      if (imageSrc) {
        const img = document.createElement("img");
        img.src = imageSrc;
        Object.assign(img.style, {
          width: "100%",
          height: "100%",
          objectFit: "cover",
        });
        clone.appendChild(img);
      }

      container.appendChild(clone);

      const animation = clone.animate(
        [
          {
            transform: `translate(${startX}px, ${startY}px) scale(1) rotate(0deg)`,
            opacity: 1,
            offset: 0,
          },
          {
            transform: `translate(${midX}px, ${midY}px) scale(0.9) rotate(140deg)`,
            opacity: 1,
            offset: 0.55,
          },
          {
            transform: `translate(${endX}px, ${endY}px) scale(0.15) rotate(300deg)`,
            opacity: 0.3,
            offset: 1,
          },
        ],
        {
          duration: 750,
          easing: "cubic-bezier(0.35, 0.02, 0.5, 1)",
          fill: "forwards",
        },
      );

      animation.onfinish = () => {
        clone.remove();
        notifyLanded();
      };
    });

    return unsubscribe;
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-9999"
    />,
    document.body,
  );
};

export default CartFlyLayer;
