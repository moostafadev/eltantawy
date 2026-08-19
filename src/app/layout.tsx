import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Layout } from "@/layouts/client";

const fontFamily = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "الطنطاوي",
  description: "جودة وطعم أصلي · رقم واحد في مصر",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${fontFamily.variable} h-full antialiased`}
    >
      <body className="flex">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
