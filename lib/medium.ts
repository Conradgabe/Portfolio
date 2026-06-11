import Parser from "rss-parser";
import { site } from "@/lib/site";

export type Post = {
  title: string;
  link: string;
  date: string;
  iso: string;
  readingMins: number;
  snippet: string;
  categories: string[];
};

const parser = new Parser();

/** Normalize em/en dashes (from external feed copy) to the site's middot separator. */
function dedash(s: string) {
  return s.replace(/\s*[—–]\s*/g, " · ");
}

function estimateMins(html?: string) {
  if (!html) return 3;
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

/** Fetch recent Medium posts. Returns [] on any failure (graceful empty state). */
export async function getMediumPosts(): Promise<Post[]> {
  try {
    const res = await fetch(site.mediumFeed, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "portfolio" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    return (feed.items ?? []).slice(0, 6).map((it) => {
      const iso = it.isoDate ?? it.pubDate ?? "";
      const d = iso ? new Date(iso) : null;
      const date = d
        ? d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "";
      const html = (it as Record<string, unknown>)["content:encoded"];
      return {
        title: dedash(it.title ?? "Untitled"),
        link: it.link ?? "#",
        date,
        iso,
        readingMins: estimateMins(typeof html === "string" ? html : it.content),
        snippet: dedash((it.contentSnippet ?? "").replace(/\s+/g, " ")).slice(0, 150),
        categories: ((it.categories as string[]) ?? []).slice(0, 3),
      };
    });
  } catch {
    return [];
  }
}
