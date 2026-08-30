"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { removeFromCartAction, updateCartItemAction } from "@/lib/cart/actions";
import { CartContextValue, CartProviderProps } from "./types";
import { CartItemWithProduct } from "../types";

const DEBOUNCE_DELAY = 350;

const CartContext = createContext<CartContextValue | null>(null);

const CartProvider = ({ children, initialCart }: CartProviderProps) => {
  const [items, setItems] = useState<CartItemWithProduct[]>(initialCart.items);

  const [isPending, startTransition] = useTransition();

  const timersRef = useRef<
    Record<string, ReturnType<typeof setTimeout> | undefined>
  >({});

  const serverQuantitiesRef = useRef<Record<string, number>>(
    Object.fromEntries(
      initialCart.items.map((item) => [item.productId, item.qty]),
    ),
  );

  const latestQuantitiesRef = useRef<Record<string, number>>(
    Object.fromEntries(
      initialCart.items.map((item) => [item.productId, item.qty]),
    ),
  );

  const requestIdsRef = useRef<Record<string, number>>({});

  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>(
    {},
  );

  const updateItemState = useCallback((productId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        return {
          ...item,
          qty: quantity,
          total: item.price * quantity,
        };
      }),
    );
  }, []);

  const markItemUpdating = useCallback((productId: string, value: boolean) => {
    setUpdatingItems((current) => ({
      ...current,
      [productId]: value,
    }));
  }, []);

  const syncQuantity = useCallback(
    (productId: string, quantity: number) => {
      const requestId = (requestIdsRef.current[productId] ?? 0) + 1;

      requestIdsRef.current[productId] = requestId;

      markItemUpdating(productId, true);

      startTransition(async () => {
        try {
          const result = await updateCartItemAction({
            productId,
            qty: quantity,
          });

          /*
           * Ignore stale response.
           */
          if (requestIdsRef.current[productId] !== requestId) {
            return;
          }

          const updatedItem = result.cart.items.find(
            (item) => item.productId === productId,
          );

          if (updatedItem) {
            serverQuantitiesRef.current[productId] = updatedItem.qty;

            latestQuantitiesRef.current[productId] = updatedItem.qty;
          }

          /*
           * Sync all calculated cart data with server.
           */
          setItems(result.cart.items);
        } catch (error) {
          console.error(error);

          if (requestIdsRef.current[productId] !== requestId) {
            return;
          }

          const serverQuantity = serverQuantitiesRef.current[productId];

          if (serverQuantity !== undefined) {
            latestQuantitiesRef.current[productId] = serverQuantity;

            updateItemState(productId, serverQuantity);
          }
        } finally {
          if (requestIdsRef.current[productId] === requestId) {
            markItemUpdating(productId, false);
          }
        }
      });
    },
    [markItemUpdating, updateItemState],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        return;
      }

      const item = items.find(
        (currentItem) => currentItem.productId === productId,
      );

      if (!item) {
        return;
      }

      const step = item.unit === "KG" ? 0.5 : 1;

      if (quantity % step !== 0) {
        return;
      }

      latestQuantitiesRef.current[productId] = quantity;

      /*
       * Instant optimistic update.
       */
      updateItemState(productId, quantity);

      /*
       * Show loading immediately.
       */
      markItemUpdating(productId, true);

      /*
       * Cancel previous debounce.
       */
      const previousTimer = timersRef.current[productId];

      if (previousTimer) {
        clearTimeout(previousTimer);
      }

      /*
       * Wait until the user stops clicking.
       */
      timersRef.current[productId] = setTimeout(() => {
        syncQuantity(productId, latestQuantitiesRef.current[productId]);
      }, DEBOUNCE_DELAY);
    },
    [items, markItemUpdating, syncQuantity, updateItemState],
  );

  const removeItem = useCallback(
    (productId: string) => {
      const timer = timersRef.current[productId];

      if (timer) {
        clearTimeout(timer);
      }

      const previousItems = items;

      const previousQuantity = latestQuantitiesRef.current[productId];

      markItemUpdating(productId, true);

      /*
       * Optimistic remove.
       */
      setItems((currentItems) =>
        currentItems.filter((item) => item.productId !== productId),
      );

      startTransition(async () => {
        try {
          await removeFromCartAction(productId);

          delete latestQuantitiesRef.current[productId];

          delete serverQuantitiesRef.current[productId];

          delete requestIdsRef.current[productId];
        } catch (error) {
          console.error(error);

          /*
           * Rollback.
           */
          setItems(previousItems);

          if (previousQuantity !== undefined) {
            latestQuantitiesRef.current[productId] = previousQuantity;
          }
        } finally {
          markItemUpdating(productId, false);
        }
      });
    },
    [items, markItemUpdating],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [items],
  );

  const discount = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (
          item.product.discountPrice === null ||
          item.product.discountPrice >= item.product.price
        ) {
          return sum;
        }

        return (
          sum + (item.product.price - item.product.discountPrice) * item.qty
        );
      }, 0),
    [items],
  );

  const deliveryFee = items.length > 0 ? 50 : 0;

  const total = subtotal - discount + deliveryFee;

  const itemCount = items.length;

  const quantity = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items],
  );

  const isUpdating = isPending || Object.values(updatingItems).some(Boolean);

  const isItemUpdating = useCallback(
    (productId: string) => Boolean(updatingItems[productId]),
    [updatingItems],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      subtotal,
      discount,
      deliveryFee,
      total,
      itemCount,
      quantity,
      isUpdating,
      updatingItems,
      isItemUpdating,
      updateQuantity,
      removeItem,
    }),
    [
      items,
      subtotal,
      discount,
      deliveryFee,
      total,
      itemCount,
      quantity,
      isUpdating,
      updatingItems,
      isItemUpdating,
      updateQuantity,
      removeItem,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};

export default CartProvider;
