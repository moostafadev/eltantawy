"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import Toaster from "./Main";
import { Toast, ToastContextValue, ToastOptions, ToastType } from "./types";

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Global toast provider. Mount once near the root of the app so any
 * descendant component can push toasts via `useToast()`.
 *
 * Timers pause while the user hovers a toast and resume on mouse leave;
 * a `loading` toast has no timer and must be dismissed manually (e.g. by
 * calling `toast.success`/`toast.error` after the async task settles,
 * or `removeToast(id)`).
 */
const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const timers = useRef<Record<string, NodeJS.Timeout>>({});
  const startTimes = useRef<Record<string, number>>({});
  const remainingTimes = useRef<Record<string, number>>({});

  const removeToast = useCallback((id: string) => {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }

    setToasts((current) =>
      current.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              closing: true,
            }
          : toast,
      ),
    );

    setTimeout(() => {
      delete startTimes.current[id];
      delete remainingTimes.current[id];

      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  const startTimer = useCallback(
    (id: string) => {
      const remaining = remainingTimes.current[id] ?? 4000;

      startTimes.current[id] = Date.now();

      timers.current[id] = setTimeout(() => {
        removeToast(id);
      }, remaining);
    },
    [removeToast],
  );

  const addToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const id = crypto.randomUUID();
      const duration = options?.duration ?? 4000;

      remainingTimes.current[id] = duration;

      setToasts((current) => [
        ...current,
        {
          id,
          type,
          message,
          duration,
          paused: false,
          closing: false,
        },
      ]);

      if (type !== "loading") {
        startTimer(id);
      }
    },
    [startTimer],
  );

  const pauseToast = useCallback((id: string) => {
    if (!timers.current[id]) return;

    clearTimeout(timers.current[id]);

    const elapsed = Date.now() - (startTimes.current[id] ?? Date.now());

    remainingTimes.current[id] = Math.max(
      0,
      (remainingTimes.current[id] ?? 0) - elapsed,
    );

    delete timers.current[id];

    setToasts((current) =>
      current.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              paused: true,
            }
          : toast,
      ),
    );
  }, []);

  const resumeToast = useCallback(
    (id: string) => {
      if (!remainingTimes.current[id]) {
        removeToast(id);
        return;
      }

      startTimer(id);

      setToasts((current) =>
        current.map((toast) =>
          toast.id === id
            ? {
                ...toast,
                paused: false,
              }
            : toast,
        ),
      );
    },
    [removeToast, startTimer],
  );

  const toast = useMemo(
    () => ({
      success: (message: string, options?: ToastOptions) =>
        addToast("success", message, options),

      error: (message: string, options?: ToastOptions) =>
        addToast("error", message, options),

      warning: (message: string, options?: ToastOptions) =>
        addToast("warning", message, options),

      info: (message: string, options?: ToastOptions) =>
        addToast("info", message, options),

      loading: (message: string) => addToast("loading", message),
    }),
    [addToast],
  );

  const value = useMemo(
    () => ({
      toast,
      removeToast,
      pauseToast,
      resumeToast,
    }),
    [toast, removeToast, pauseToast, resumeToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <Toaster
        toasts={toasts}
        removeToast={removeToast}
        pauseToast={pauseToast}
        resumeToast={resumeToast}
      />
    </ToastContext.Provider>
  );
};

/**
 * Hook to push/dismiss toasts. Must be used inside `ToastProvider`.
 *
 * @example
 * const { toast } = useToast();
 * toast.success("تم الحفظ بنجاح.");
 * toast.error(result.message);
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};

export default ToastProvider;
