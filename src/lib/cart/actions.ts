"use server";

import { CartService } from "./service";

import { CartUnit } from "./types";

export async function addToCartAction(data: {
  productId: string;

  qty: number;

  unit: CartUnit;

  weightOptionId?: string;
}) {
  return CartService.addItem(data);
}

export async function updateCartItemAction(data: {
  productId: string;

  unit: CartUnit;

  qty: number;

  weightOptionId?: string;
}) {
  return CartService.updateItem(data);
}

export async function removeFromCartAction(data: {
  productId: string;

  unit: CartUnit;

  weightOptionId?: string;
}) {
  return CartService.removeItem(data.productId, data.unit, data.weightOptionId);
}

export async function clearCartAction() {
  return CartService.clear();
}
