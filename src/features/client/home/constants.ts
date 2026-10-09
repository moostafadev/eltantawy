import {
  ClipboardList,
  Info,
  LayoutGrid,
  MapPin,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Sparkles,
  Truck,
  TrendingUp,
} from "lucide-react";

export const orderSteps = [
  {
    title: "تصفح المنتجات",
    desc: "تصفّح تشكيلة اللحوم والدواجن واختر المنتجات التي تحتاجها.",
    icon: Search,
  },
  {
    title: "أضف للسلة",
    desc: "اختر الكمية أو الوزن المناسب، ثم أضف المنتجات إلى سلتك.",
    icon: ShoppingCart,
  },
  {
    title: "أدخل بياناتك",
    desc: "أدخل عنوان التوصيل ورقم التواصل لإتمام طلبك.",
    icon: MapPin,
  },
  {
    title: "استلم طلبك",
    desc: "نتواصل معك لتأكيد الطلب ثم نوصله إلى عنوانك.",
    icon: Truck,
  },
];

export const aboutFeatures = [
  {
    title: "مزارعنا الخاصة",
    desc: "نعتني باختيار المنتجات ومتابعة جودتها من المصدر حتى تجهيز طلبك.",
    icon: Sprout,
  },
  {
    title: "جودة وسلامة غذائية",
    desc: "نولي عناية خاصة بسلامة المنتجات خلال الاختيار والتجهيز والتوصيل.",
    icon: ShieldCheck,
  },
  {
    title: "عناية من البداية للنهاية",
    desc: "نجهّز كل طلب بعناية ونحرص على وصوله إليك في أفضل حالة ممكنة.",
    icon: Sparkles,
  },
  {
    title: "توصيل مخصص لمنطقتك",
    desc: "نوصّل حاليًا إلى مدينة 6 أكتوبر والشيخ زايد، ونعمل على خدمة مناطق جديدة.",
    icon: Truck,
  },
];

export const aboutStats = [
  { value: "بكل عناية", label: "اختيار وتجهيز المنتجات" },
  { value: "٢", label: "منطقة توصيل حاليًا" },
  { value: "بوضوح", label: "أسعار ومعلومات المنتجات" },
];

export const sectionIcons = {
  bestSellers: TrendingUp,
  about: Info,
  howToOrder: ClipboardList,
  categories: LayoutGrid,
};
