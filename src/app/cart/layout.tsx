import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "سلة التسوق",
  description: "راجع منتجاتك في السلة قبل إتمام الطلب.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
