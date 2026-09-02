"use client";

export const toNativeScrollLeft = (
  _container: HTMLElement,
  logicalOffset: number,
) => -logicalOffset;

export const toLogicalScrollLeft = (container: HTMLElement) =>
  -container.scrollLeft;
