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
    desc: "اختر منتجاتك المفضلة من بين تشكيلة اللحوم والدواجن الطازجة.",
    icon: Search,
  },
  {
    title: "أضف للسلة",
    desc: "حدد الكمية أو الوزن المناسب وأضف المنتج إلى سلة التسوق.",
    icon: ShoppingCart,
  },
  {
    title: "أدخل بياناتك",
    desc: "أدخل عنوانك وبيانات التواصل لإتمام الطلب بسهولة.",
    icon: MapPin,
  },
  {
    title: "استلم طلبك",
    desc: "استلم طلبك طازجًا عند بابك في أسرع وقت ممكن.",
    icon: Truck,
  },
];

export const aboutFeatures = [
  {
    title: "مزارعنا الخاصة",
    desc: "منتجاتنا مصدرها مزارعنا المصرية الخاصة مباشرة، بدون وسطاء، لضمان جودة وطعم أصلي.",
    icon: Sprout,
  },
  {
    title: "جودة وسلامة غذائية",
    desc: "نلتزم بأعلى معايير السلامة الغذائية في كل مراحل الاختيار والتجهيز والتوريد.",
    icon: ShieldCheck,
  },
  {
    title: "طازج دايمًا",
    desc: "منتجات طازجة يوميًا، محضّرة بعناية فائقة لتصل إليك بأفضل حالة ممكنة.",
    icon: Sparkles,
  },
  {
    title: "توصيل مخصص لمنطقتك",
    desc: "التوصيل متاح حاليًا في 6 أكتوبر والشيخ زايد فقط، حفاظًا على تجميد المنتجات وجودتها حتى تصل إليك.",
    icon: Truck,
  },
];

export const aboutStats = [
  { value: "100%", label: "مزارع مصرية خاصة" },
  { value: "٢", label: "منطقة توصيل حاليًا" },
  { value: "٠٪", label: "وسطاء بين المزرعة وطبقك" },
];

export const sectionIcons = {
  bestSellers: TrendingUp,
  about: Info,
  howToOrder: ClipboardList,
  categories: LayoutGrid,
};
