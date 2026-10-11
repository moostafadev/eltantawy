"use client";

import { useEffect } from "react";

const DeferredManifest = () => {
  useEffect(() => {
    if (document.querySelector('link[rel="manifest"]')) {
      return;
    }

    const addManifest = () => {
      const link = document.createElement("link");
      link.rel = "manifest";
      link.href = "/manifest.json";
      document.head.appendChild(link);
    };

    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (win.requestIdleCallback) {
      idleId = win.requestIdleCallback(addManifest);
    } else {
      timeoutId = window.setTimeout(addManifest, 1000);
    }

    return () => {
      if (idleId && win.cancelIdleCallback) {
        win.cancelIdleCallback(idleId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return null;
};

export default DeferredManifest;
