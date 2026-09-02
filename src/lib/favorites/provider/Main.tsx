"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { removeFavoriteAction, toggleFavoriteAction } from "../actions";

import { HydratedFavorites } from "../types";

import { FavoritesContextValue, FavoritesProviderProps } from "./types";

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const FavoritesProvider = ({
  children,
  initialFavorites,
}: FavoritesProviderProps) => {
  const [favorites, setFavorites] =
    useState<HydratedFavorites>(initialFavorites);

  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>(
    {},
  );

  const markUpdating = useCallback((productId: string, value: boolean) => {
    setUpdatingItems((prev) => ({
      ...prev,
      [productId]: value,
    }));
  }, []);

  const favoriteIds = useMemo(
    () => new Set(favorites.items.map((item) => item.id)),
    [favorites.items],
  );

  const toggleFavorite = useCallback(
    async (productId: string) => {
      markUpdating(productId, true);

      try {
        const result = await toggleFavoriteAction(productId);

        setFavorites(result);
      } finally {
        markUpdating(productId, false);
      }
    },
    [markUpdating],
  );

  const removeFavorite = useCallback(
    async (productId: string) => {
      markUpdating(productId, true);

      try {
        const result = await removeFavoriteAction(productId);

        setFavorites(result);
      } finally {
        markUpdating(productId, false);
      }
    },
    [markUpdating],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,

      count: favorites.count,

      isFavorite: (productId) => favoriteIds.has(productId),

      isItemUpdating: (productId) => Boolean(updatingItems[productId]),

      toggleFavorite,

      removeFavorite,
    }),
    [favorites, favoriteIds, updatingItems, toggleFavorite, removeFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
};

export default FavoritesProvider;
