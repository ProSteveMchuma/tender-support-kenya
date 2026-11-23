import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { isIndexable } from "@/lib/readiness";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  if (!isIndexable(site, process.env) || !base) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${base}/sitemap.xml` };
}
