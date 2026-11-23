import type { Metadata } from "next";
import { site } from "@/config/site";
import { isIndexable } from "@/lib/readiness";

export function siteUrl(): string | null {
  return site.domain ? `https://${site.domain}` : null;
}

/** Page metadata. Canonicals only exist with a real domain; noindex until production-ready. */
export function pageMeta(path: string, title: string, description: string): Metadata {
  const base = siteUrl();
  const indexable = isIndexable(site, process.env);
  return {
    title,
    description,
    ...(base ? { alternates: { canonical: `${base}${path}` } } : {}),
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
    openGraph: {
      title,
      description,
      siteName: site.name,
      locale: "en_KE",
      type: "website",
      ...(base ? { url: `${base}${path}` } : {}),
    },
  };
}
