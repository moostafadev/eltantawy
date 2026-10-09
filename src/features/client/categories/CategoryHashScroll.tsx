"use client";

import { useEffect } from "react";

const CategoryHashScroll = () => {
  useEffect(() => {
    const hash = window.location.hash.slice(1);

    if (!hash) return;

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return null;
};

export default CategoryHashScroll;
