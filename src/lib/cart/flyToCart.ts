"use client";

type FlyDetail = {
  fromEl: HTMLElement;
  imageSrc?: string;
};

const FLY_EVENT = "cart:fly";
const LAND_EVENT = "cart:landed";

let cartTargetEl: HTMLElement | null = null;

export function registerCartTarget(el: HTMLElement | null) {
  cartTargetEl = el;
}

export function getCartTarget() {
  return cartTargetEl;
}

export function flyToCart(fromEl: HTMLElement | null, imageSrc?: string) {
  if (!fromEl) return;
  window.dispatchEvent(
    new CustomEvent<FlyDetail>(FLY_EVENT, { detail: { fromEl, imageSrc } }),
  );
}

export function onFlyToCart(handler: (detail: FlyDetail) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<FlyDetail>).detail);
  window.addEventListener(FLY_EVENT, listener);
  return () => window.removeEventListener(FLY_EVENT, listener);
}

export function notifyLanded() {
  window.dispatchEvent(new Event(LAND_EVENT));
}

export function onCartLanded(handler: () => void) {
  window.addEventListener(LAND_EVENT, handler);
  return () => window.removeEventListener(LAND_EVENT, handler);
}
