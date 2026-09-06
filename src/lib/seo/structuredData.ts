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
 * JSON-LD Schema لصفحة منتج واحد (Product Schema)
 * بيساعد جوجل يعرض Rich Snippets (سعر، توفر، تقييم) في نتائج البحث
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
 * JSON-LD Schema لمسار التنقل (Breadcrumb)، بيظهر في نتائج البحث
 * كمسار تحت العنوان بدل الرابط الخام
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

/**
 * JSON-LD Schema للمنظمة، بيتحط في الـ layout الرئيسي مرة واحدة
 */
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`,
  description: SITE_CONFIG.description,
  areaServed: ["6 أكتوبر", "الشيخ زايد"],
};
