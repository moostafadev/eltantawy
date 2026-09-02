"use server";

import { FavoritesService } from "./service";

export async function toggleFavoriteAction(productId: string) {
  return FavoritesService.toggleItem(productId);
}

export async function removeFavoriteAction(productId: string) {
  return FavoritesService.removeItem(productId);
}

export async function clearFavoritesAction() {
  return FavoritesService.clear();
}
