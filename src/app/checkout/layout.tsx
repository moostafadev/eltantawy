import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "إتمام الطلب",
  description: "أكمل بيانات طلبك واختر منطقة التوصيل.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
