export interface FavoriteItem {
  productId: string;
}

export interface Favorites {
  items: FavoriteItem[];
}

export interface FavoriteProduct {
  id: string;
  title: string;
  image: string | null;
  price: number;
  discountPrice: number | null;
  unit: "KG" | "PIECE";
}

export interface HydratedFavorites {
  items: FavoriteProduct[];
  count: number;
}
