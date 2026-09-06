import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "المفضلة",
  description: "منتجاتك المفضلة في مكان واحد لسهولة الرجوع إليها لاحقًا.",
  path: "/favorites",
  noIndex: true,
});

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
