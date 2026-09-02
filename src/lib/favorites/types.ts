export interface FavoriteItem {
  productId: string;
}

export interface Favorites {
  items: FavoriteItem[];
}

export interface FavoriteWeightOption {
  id: string;
  name: string;
  minWeight: number;
  maxWeight: number;
}

export interface FavoriteProduct {
  id: string;
  title: string;
  image: string | null;
  price: number;
  discountPrice: number | null;
  unit: "KG" | "PIECE";
  saleType: "NORMAL" | "WEIGHT_RANGE";
  weightOptions: FavoriteWeightOption[];
}

export interface HydratedFavorites {
  items: FavoriteProduct[];
  count: number;
}
