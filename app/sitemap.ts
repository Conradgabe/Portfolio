import type { MetadataRoute } from "next";
import { projects, site } from "@/lib/site";

const BASE = site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/resume", ...projects.map((p) => `/projects/${p.slug}`)];
  return paths.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
