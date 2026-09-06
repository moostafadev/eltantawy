import { Offers } from "@/features/client/offers";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "العروض والخصومات",
  description:
    "اكتشف أقوى العروض والخصومات على اللحوم والدواجن الطازجة من الطنطاوي، خصومات مباشرة وعروض حصرية لفترة محدودة.",
  path: "/offers",
  keywords: ["عروض لحوم", "خصومات لحوم", "عروض دواجن"],
});

const OffersPage = () => {
  return <Offers />;
};

export default OffersPage;
