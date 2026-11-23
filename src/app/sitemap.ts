import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { isIndexable } from "@/lib/readiness";
import { siteUrl } from "@/lib/seo";

const PATHS = ["", "/tender-preparation", "/tender-sourcing", "/printing-and-submission-support", "/contact", "/privacy", "/terms"];

/** Empty until a real domain is configured and the site is production-ready. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base || !isIndexable(site, process.env)) return [];
  return PATHS.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
