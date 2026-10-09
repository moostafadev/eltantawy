import type { Metadata } from "next";

import { SITE_CONFIG } from "./config";
import { buildMetadata } from "./metadata";
import { getSeoSettings } from "@/features/admin/settings/seo";

/**
 * Builds metadata for the root layout and home page from admin-managed SEO
 * settings, falling back to `SITE_CONFIG` defaults when settings are absent.
 */
export const getRootMetadata = async (): Promise<Metadata> => {
  const settings = await getSeoSettings();

  return {
    ...buildMetadata(
      {
        title: settings.siteTitle,
        description: settings.siteDescription,
        path: "/",
        image: settings.ogImage,
        isHome: true,
      },
      settings.keywords,
    ),
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.siteTitle}`,
    },
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
    verification: {
      // Add the Google Search Console verification code here when available:
      // google: "YOUR_VERIFICATION_CODE",
    },
  };
};
