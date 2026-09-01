import { CartItemWithProduct, HydratedCart } from "@/lib/cart/types";

import { ProductCardProduct } from "../product-card/types";

export interface AddToCartDialogProps {
  product: ProductCardProduct;
}

export interface CartProviderProps {
  children: React.ReactNode;

  initialCart: HydratedCart;
}

export interface CartContextValue {
  cart: HydratedCart;

  items: CartItemWithProduct[];

  subtotal: number;

  discount: number;

  deliveryFee: number;

  total: number;

  itemCount: number;

  quantity: number;

  syncCart: (cart: HydratedCart) => void;

  isUpdating: boolean;

  updatingItems: Record<string, boolean>;

  isItemUpdating(productId: string): boolean;

  updateQuantity(productId: string, quantity: number): void;

  removeItem(productId: string): void;
}
