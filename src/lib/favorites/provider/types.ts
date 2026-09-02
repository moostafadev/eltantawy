import { HydratedFavorites } from "../types";

export interface FavoritesProviderProps {
  children: React.ReactNode;

  initialFavorites: HydratedFavorites;
}

export interface FavoritesContextValue {
  favorites: HydratedFavorites;

  count: number;

  isFavorite(productId: string): boolean;

  isItemUpdating(productId: string): boolean;

  toggleFavorite(productId: string): Promise<void>;

  removeFavorite(productId: string): Promise<void>;
}
