"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  addToCartAction,
  removeFromCartAction,
  updateCartItemAction,
} from "../actions";

import { CartContextValue, CartProviderProps } from "./types";

import { CartUnit, HydratedCart } from "../types";

const CartContext = createContext<CartContextValue | null>(null);

const getKey = (productId: string, unit: CartUnit) => `${productId}-${unit}`;

const CartProvider = ({ children, initialCart }: CartProviderProps) => {
  const [cart, setCart] = useState<HydratedCart>(initialCart);

  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>(
    {},
  );

  const markUpdating = useCallback((key: string, value: boolean) => {
    setUpdatingItems((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const syncCart = useCallback((newCart: HydratedCart) => {
    setCart(newCart);
  }, []);

  const addItem = useCallback(
    async (data: { productId: string; qty: number; unit: CartUnit }) => {
      const result = await addToCartAction(data);

      syncCart(result);
    },
    [syncCart],
  );

  const updateItem = useCallback(
    async (productId: string, unit: CartUnit, qty: number) => {
      const key = getKey(productId, unit);

      markUpdating(key, true);

      try {
        const result = await updateCartItemAction({
          productId,
          unit,
          qty,
        });

        syncCart(result);
      } finally {
        markUpdating(key, false);
      }
    },
    [markUpdating, syncCart],
  );

  const removeItem = useCallback(
    async (productId: string, unit: CartUnit) => {
      const key = getKey(productId, unit);

      markUpdating(key, true);

      try {
        const result = await removeFromCartAction({
          productId,
          unit,
        });

        syncCart(result);
      } finally {
        markUpdating(key, false);
      }
    },
    [markUpdating, syncCart],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,

      items: cart.items ?? [],

      syncCart,

      isUpdating: Object.values(updatingItems).some(Boolean),

      updatingItems,

      isItemUpdating: (key) => Boolean(updatingItems[key]),

      addItem,

      updateItem,

      removeItem,
    }),
    [cart, syncCart, updatingItems, addItem, updateItem, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be inside CartProvider");
  }

  return context;
};

export default CartProvider;
