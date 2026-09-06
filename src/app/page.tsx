import { Home } from "@/features/client/home";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "الطنطاوي",
  description:
    "تسوق أفضل اللحوم والدواجن الطازجة من الطنطاوي، منتجات من مزارعنا الخاصة توصلك طازجة يوميًا في 6 أكتوبر والشيخ زايد.",
  path: "/",
});

const Page = () => {
  return <Home />;
};

export default Page;
