"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  X,
  TriangleAlert,
} from "lucide-react";

import { Toast } from "./types";

interface ToasterProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
  pauseToast: (id: string) => void;
  resumeToast: (id: string) => void;
}

/**
 * Internal toast list renderer, mounted by `ToastProvider`. Not meant to
 * be used directly — push toasts through `useToast()` instead.
 *
 * Supports swipe-to-dismiss (drag a toast horizontally past ~100px).
 */
const Toaster = ({
  toasts,
  removeToast,
  pauseToast,
  resumeToast,
}: ToasterProps) => {
  const pointerStart = useRef<number | null>(null);
  const swipeValues = useRef<Record<string, number>>({});
  const [swipeX, setSwipeX] = useState<Record<string, number>>({});

  const config = {
    success: {
      icon: CheckCircle2,
      className:
        "border-green-300 bg-green-100 text-green-800 shadow-green-200/50",
      iconClass: "bg-green-200 text-green-700",
    },

    error: {
      icon: AlertCircle,
      className: "border-red-300 bg-red-100 text-red-800 shadow-red-200/50",
      iconClass: "bg-red-200 text-red-700",
    },

    warning: {
      icon: TriangleAlert,
      className:
        "border-yellow-300 bg-yellow-100 text-yellow-800 shadow-yellow-200/50",
      iconClass: "bg-yellow-200 text-yellow-700",
    },

    info: {
      icon: Info,
      className: "border-blue-300 bg-blue-100 text-blue-800 shadow-blue-200/50",
      iconClass: "bg-blue-200 text-blue-700",
    },

    loading: {
      icon: Loader2,
      className: "border-gray-300 bg-gray-100 text-gray-800 shadow-gray-200/50",
      iconClass: "bg-gray-200 text-gray-700",
    },
  };

  return (
    <div className="pointer-events-none fixed inset-x-4 top-3 lg:top-auto lg:bottom-4 z-9999 flex flex-col gap-3 sm:left-auto sm:right-4 sm:w-full sm:max-w-md">
      {toasts.map((toast) => {
        const item = config[toast.type];
        const Icon = item.icon;

        return (
          <div key={toast.id} className="animate-toast-in">
            <div
              role="alert"
              dir="rtl"
              onMouseEnter={() => pauseToast(toast.id)}
              onMouseLeave={() => resumeToast(toast.id)}
              onPointerDown={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;

                pointerStart.current = e.clientX;

                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (pointerStart.current === null) return;

                const diff = e.clientX - pointerStart.current;

                swipeValues.current[toast.id] = diff;

                setSwipeX((current) => ({
                  ...current,
                  [toast.id]: diff,
                }));
              }}
              onPointerUp={() => {
                const distance = swipeValues.current[toast.id] ?? 0;

                if (Math.abs(distance) > 100) {
                  removeToast(toast.id);
                } else {
                  setSwipeX((current) => ({
                    ...current,
                    [toast.id]: 0,
                  }));
                }

                delete swipeValues.current[toast.id];
                pointerStart.current = null;
              }}
              onPointerCancel={() => {
                setSwipeX((current) => ({
                  ...current,
                  [toast.id]: 0,
                }));

                delete swipeValues.current[toast.id];
                pointerStart.current = null;
              }}
              style={{
                transform: toast.closing
                  ? "translateX(120%)"
                  : `translateX(${swipeX[toast.id] ?? 0}px)`,

                opacity: toast.closing
                  ? 0
                  : Math.max(0.4, 1 - Math.abs(swipeX[toast.id] ?? 0) / 150),

                transition: toast.closing
                  ? "all 300ms ease-in"
                  : "transform 300ms ease",
              }}
              className={`pointer-events-auto relative flex w-full select-none touch-none cursor-grab items-start gap-3 overflow-hidden border p-4 shadow-lg backdrop-blur-md transition-transform duration-300 active:cursor-grabbing ${item.className}`}
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full ${item.iconClass}`}
              >
                <Icon
                  className={`size-5 ${
                    toast.type === "loading" ? "animate-spin" : ""
                  }`}
                />
              </div>

              <p className="flex-1 pt-1 text-sm font-semibold leading-6 text-current">
                {toast.message}
              </p>

              {toast.type !== "loading" && (
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => removeToast(toast.id)}
                  aria-label="إغلاق"
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-current/70 transition hover:bg-current/10 hover:text-current active:scale-95"
                >
                  <X className="size-4" />
                </button>
              )}

              {toast.type !== "loading" && (
                <span
                  className="absolute bottom-0 right-0 h-1 w-full origin-right animate-toast-progress bg-current opacity-40"
                  style={{
                    animationDuration: `${toast.duration}ms`,
                    animationPlayState: toast.paused ? "paused" : "running",
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;
