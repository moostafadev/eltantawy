import { Cairo } from "next/font/google";
import "./globals.css";

import { Layout } from "@/layouts/client";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/toaster";
import { StructuredData } from "@/components/structured-data";
import { DeferredManifest } from "@/components/deferred-manifest";
import { getRootMetadata } from "@/lib/seo/rootMetadata";
import { organizationStructuredData } from "@/lib/seo/structuredData";

const fontFamily = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: "variable",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const generateMetadata = async () => getRootMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${fontFamily.variable} h-full scroll-smooth antialiased motion-reduce:scroll-auto`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Eltantawy" />
        <link
          rel="preload"
          as="image"
          href="/logo-lcp.avif"
          type="image/avif"
          fetchPriority="high"
        />
      </head>
      <body className="flex flex-col">
        <StructuredData data={organizationStructuredData} />
        <DeferredManifest />

        <AuthProvider>
          <ToastProvider>
            <Layout>{children}</Layout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
