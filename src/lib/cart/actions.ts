"use server";

import { CartService } from "./service";

import { CartUnit } from "./types";

export async function addToCartAction(data: {
  productId: string;

  qty: number;

  unit: CartUnit;
}) {
  return CartService.addItem(data);
}

export async function updateCartItemAction(data: {
  productId: string;

  unit: CartUnit;

  qty: number;
}) {
  return CartService.updateItem(data);
}

export async function removeFromCartAction(data: {
  productId: string;

  unit: CartUnit;
}) {
  return CartService.removeItem(data.productId, data.unit);
}

export async function clearCartAction() {
  return CartService.clear();
}
