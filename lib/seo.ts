import type { Metadata } from "next";
import type { SeoMetadata } from "@/types/content";

/** Converts editable SEO content into Next metadata without inventing a production domain. */
export function createMetadata(seo: SeoMetadata): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      type: "website",
    },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
  };
}
