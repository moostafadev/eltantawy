import { Favorites } from "./types";

export const EMPTY_FAVORITES = (): Favorites => ({
  items: [],
});

export const parseFavorites = (value?: string): Favorites => {
  if (!value) {
    return EMPTY_FAVORITES();
  }

  try {
    const parsed = JSON.parse(value);

    if (!parsed || !Array.isArray(parsed.items)) {
      return EMPTY_FAVORITES();
    }

    return {
      items: parsed.items.filter(isValidFavoriteItem),
    };
  } catch {
    return EMPTY_FAVORITES();
  }
};

const isValidFavoriteItem = (item: unknown): item is FavoriteItemLike => {
  if (!item || typeof item !== "object") {
    return false;
  }

  const value = item as Record<string, unknown>;

  return typeof value.productId === "string" && value.productId.length > 0;
};

type FavoriteItemLike = { productId: string };

export const serializeFavorites = (favorites: Favorites) => {
  return JSON.stringify(favorites);
};

export const isProductFavorited = (favorites: Favorites, productId: string) => {
  return favorites.items.some((item) => item.productId === productId);
};

export const addFavoriteItem = (
  favorites: Favorites,
  productId: string,
): Favorites => {
  if (isProductFavorited(favorites, productId)) {
    return favorites;
  }

  return {
    items: [...favorites.items, { productId }],
  };
};

export const removeFavoriteItem = (
  favorites: Favorites,
  productId: string,
): Favorites => {
  return {
    items: favorites.items.filter((item) => item.productId !== productId),
  };
};

export const toggleFavoriteItem = (
  favorites: Favorites,
  productId: string,
): Favorites => {
  return isProductFavorited(favorites, productId)
    ? removeFavoriteItem(favorites, productId)
    : addFavoriteItem(favorites, productId);
};

export const clearFavorites = (): Favorites => EMPTY_FAVORITES();
