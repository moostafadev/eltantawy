export type CartUnit = "KG" | "PIECE";

export interface CartItem {
  productId: string;

  qty: number;

  unit: CartUnit;
}

export interface Cart {
  items: CartItem[];
}

export interface CartProduct {
  id: string;

  title: string;

  image: string | null;

  price: number;

  discountPrice: number | null;

  unit: CartUnit;
}

export interface CartItemWithProduct extends CartItem {
  product: CartProduct;

  /**
   * السعر بعد الخصم
   */
  price: number;

  /**
   * السعر النهائي للكمية
   */
  total: number;
}

export interface HydratedCart {
  items: CartItemWithProduct[];

  subtotal: number;

  discount: number;

  deliveryFee: number;

  total: number;

  /**
   * عدد المنتجات المختلفة
   */
  itemCount: number;

  /**
   * مجموع الكميات
   * مثال:
   * 2 كيلو + 3 قطع = 5
   */
  quantity: number;
}
