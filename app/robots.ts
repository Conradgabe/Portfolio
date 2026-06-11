import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const BASE = site.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
