import { cookies } from "next/headers";

import { prisma } from "../prisma";

import { FAVORITES_COOKIE_NAME, FAVORITES_COOKIE_OPTIONS } from "./constants";

import {
  addFavoriteItem,
  clearFavorites,
  isProductFavorited,
  parseFavorites,
  removeFavoriteItem,
  serializeFavorites,
  toggleFavoriteItem,
} from "./utils";

import { Favorites, HydratedFavorites } from "./types";

export class FavoritesService {
  private static async getFavorites(): Promise<Favorites> {
    const cookieStore = await cookies();

    const cookie = cookieStore.get(FAVORITES_COOKIE_NAME);

    return parseFavorites(cookie?.value);
  }

  private static async saveFavorites(favorites: Favorites) {
    const cookieStore = await cookies();

    cookieStore.set(
      FAVORITES_COOKIE_NAME,
      serializeFavorites(favorites),
      FAVORITES_COOKIE_OPTIONS,
    );
  }

  static async toggleItem(productId: string): Promise<HydratedFavorites> {
    const favorites = await this.getFavorites();

    const updated = toggleFavoriteItem(favorites, productId);

    await this.saveFavorites(updated);

    return this.getHydratedFavorites();
  }

  static async removeItem(productId: string): Promise<HydratedFavorites> {
    const favorites = await this.getFavorites();

    const updated = removeFavoriteItem(favorites, productId);

    await this.saveFavorites(updated);

    return this.getHydratedFavorites();
  }

  static async clear(): Promise<HydratedFavorites> {
    await this.saveFavorites(clearFavorites());

    return this.getHydratedFavorites();
  }

  static async isFavorited(productId: string): Promise<boolean> {
    const favorites = await this.getFavorites();

    return isProductFavorited(favorites, productId);
  }

  static async getHydratedFavorites(): Promise<HydratedFavorites> {
    const favorites = await this.getFavorites();

    if (!favorites.items.length) {
      return {
        items: [],
        count: 0,
      };
    }

    const ids = favorites.items.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },

      select: {
        id: true,
        title: true,
        image: true,
        price: true,
        discountPrice: true,
        unit: true,
      },
    });

    const map = new Map(products.map((product) => [product.id, product]));

    // نحافظ على ترتيب الإضافة بدل ترتيب الداتابيز
    const items = ids
      .map((id) => map.get(id))
      .filter((product): product is NonNullable<typeof product> =>
        Boolean(product),
      );

    return {
      items,
      count: items.length,
    };
  }
}
