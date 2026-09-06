import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

import { Layout } from "@/layouts/client";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/toaster";
import { StructuredData } from "@/components/structured-data";
import { rootMetadata } from "@/lib/seo/metadata";
import { organizationStructuredData } from "@/lib/seo/structuredData";

const fontFamily = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${fontFamily.variable} h-full antialiased`}
    >
      <body className="flex flex-col">
        <StructuredData data={organizationStructuredData} />

        <AuthProvider>
          <ToastProvider>
            <Layout>{children}</Layout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
