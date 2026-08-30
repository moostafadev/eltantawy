import { ProductCardProduct } from "@/features/client/product-card/types";
import { CartItemWithProduct, HydratedCart } from "@/lib/cart/types";

export interface AddToCartDialogProps {
  product: ProductCardProduct;
}

export interface CartProviderProps {
  children: React.ReactNode;
  initialCart: HydratedCart;
}

export interface CartContextValue {
  items: CartItemWithProduct[];

  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;

  itemCount: number;
  quantity: number;

  isUpdating: boolean;

  updatingItems: Record<string, boolean>;

  isItemUpdating: (productId: string) => boolean;

  updateQuantity: (productId: string, quantity: number) => void;

  removeItem: (productId: string) => void;
}
