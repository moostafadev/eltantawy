import { SITE_CONFIG } from "./config";

interface ProductStructuredDataParams {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  price: number;
  discountPrice?: number | null;
  unit: "KG" | "PIECE";
  categoryTitle?: string;
}

/**
 * Builds Product JSON-LD for a product page to help search engines display
 * rich results such as price, availability, and ratings.
 */
export const buildProductStructuredData = ({
  id,
  title,
  description,
  image,
  price,
  discountPrice,
  unit,
  categoryTitle,
}: ProductStructuredDataParams) => {
  const finalPrice =
    discountPrice !== null &&
    discountPrice !== undefined &&
    discountPrice < price
      ? discountPrice
      : price;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description || `${title} - ${SITE_CONFIG.name}`,
    image: image ? [image] : [`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`],
    sku: id,
    ...(categoryTitle && { category: categoryTitle }),
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.url}/products/${id}`,
      priceCurrency: "EGP",
      price: finalPrice,
      availability: "https://schema.org/InStock",
      unitText: unit === "KG" ? "كيلوجرام" : "قطعة",
    },
  };
};

interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Builds Breadcrumb JSON-LD so search results can show a navigation path
 * beneath the page title instead of a raw URL.
 */
export const buildBreadcrumbStructuredData = (items: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path}`,
    })),
  };
};

/** Organization JSON-LD data to include once in the root layout. */
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`,
  description: SITE_CONFIG.description,
  areaServed: ["6 أكتوبر", "الشيخ زايد"],
};
