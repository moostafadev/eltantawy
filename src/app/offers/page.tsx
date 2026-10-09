import { Offers } from "@/features/client/offers";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "العروض والخصومات",
  description:
    "اطّلع على تخفيضات منتجات اللحوم والدواجن والعروض المتاحة من الطنطاوي، وتعرّف على شروط الخصم قبل إتمام طلبك.",
  path: "/offers",
  keywords: ["عروض لحوم", "خصومات لحوم", "عروض دواجن"],
});

const OffersPage = () => {
  return <Offers />;
};

export default OffersPage;
