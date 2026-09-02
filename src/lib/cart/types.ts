export type CartUnit = "KG" | "PIECE";

export type ProductSaleType = "NORMAL" | "WEIGHT_RANGE";

export interface CartItem {
  productId: string;

  qty: number;

  unit: CartUnit;

  /**
   * موجود فقط لو المنتج نوع بيعه "نطاق وزن"
   * وقتها qty تمثل عدد العبوات، مش الوزن مباشرة
   */
  weightOptionId?: string;
}

export interface Cart {
  items: CartItem[];
}

export interface CartWeightOption {
  id: string;

  name: string;

  minWeight: number;

  maxWeight: number;
}

export interface CartProduct {
  id: string;

  title: string;

  image: string | null;

  price: number;

  discountPrice: number | null;

  unit: CartUnit;

  saleType: ProductSaleType;
}

export interface CartItemWithProduct extends CartItem {
  product: CartProduct;

  /**
   * السعر بعد الخصم لوحدة واحدة (كيلو/قطعة)
   */
  price: number;

  /**
   * السعر التقديري للعنصر (بيمثل متوسط النطاق لو تقريبي)
   */
  total: number;

  /**
   * true لو السعر تقريبي (منتج نطاق وزن)
   */
  isApprox: boolean;

  /**
   * تفاصيل خيار الوزن المختار لو المنتج نطاق وزن
   */
  weightOption?: CartWeightOption;

  /**
   * أقل سعر متوقع (لو تقريبي)
   */
  minTotal?: number;

  /**
   * أعلى سعر متوقع (لو تقريبي)
   */
  maxTotal?: number;
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

  /**
   * true لو فيه منتج واحد على الأقل سعره تقريبي (نطاق وزن)
   */
  hasApproxItems: boolean;

  /**
   * أقل إجمالي متوقع للسلة (شامل التوصيل)
   */
  minTotal: number;

  /**
   * أعلى إجمالي متوقع للسلة (شامل التوصيل)
   */
  maxTotal: number;
}
