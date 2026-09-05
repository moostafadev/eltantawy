export type CartUnit = "KG" | "PIECE";

export type ProductSaleType = "NORMAL" | "WEIGHT_RANGE";

export type DiscountSource = "COUPON" | "ALL_CUSTOMERS" | "REGISTERED_ONLY";

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

  /**
   * كود الكوبون المطبق حاليًا على السلة (لو موجود)
   * بيتخزن دايمًا بحروف كبيرة (Uppercase)
   */
  couponCode?: string;
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

  /**
   * خصومات مستوى المنتج نفسه (discountPrice)
   */
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
   * أقل إجمالي متوقع للسلة (شامل التوصيل وكل الخصومات)
   */
  minTotal: number;

  /**
   * أعلى إجمالي متوقع للسلة (شامل التوصيل وكل الخصومات)
   */
  maxTotal: number;

  /**
   * كود الكوبون المُدخل حاليًا (لو صالح بذاته)، أو null.
   * ملاحظة: مش بالضرورة هو مصدر الخصم الفعلي المطبق،
   * ممكن يكون فيه خصم تلقائي أعلى منه قيمة (راجع appliedDiscountSource)
   */
  couponCode: string | null;

  /**
   * القيمة اللي كان هيوفرها الكوبون المُدخل تحديدًا (لو صالح)
   */
  couponDiscountAmount: number;

  /**
   * القيمة اللي بيوفرها أفضل خصم تلقائي متاح (لكل العملاء/للمسجلين)
   */
  autoDiscountAmount: number;

  /**
   * وصف الخصم التلقائي المتاح (لو موجود)
   */
  autoDiscountLabel: string | null;

  /**
   * القيمة الفعلية المخصومة من الإجمالي = الأكبر بين الكوبون والخصم التلقائي
   */
  discountAmount: number;

  /**
   * مصدر الخصم الفعلي المطبق حاليًا على الإجمالي، أو null لو مفيش خصم
   */
  appliedDiscountSource: DiscountSource | null;

  /**
   * وصف نصي للخصم الفعلي المطبق (يُعرض في ملخص السلة)
   */
  appliedDiscountLabel: string | null;
}
