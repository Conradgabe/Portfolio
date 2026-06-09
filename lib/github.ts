import { site } from "@/lib/site";

export type Contrib = { date: string; count: number; level: number };

export type GithubData = {
  profile: { public_repos: number; followers: number; following: number } | null;
  contributions: Contrib[];
  totalContrib: number;
  languages: { name: string; pct: number }[];
};

const USER = site.githubUser;

async function safeJson(url: string, revalidate = 3600): Promise<unknown> {
  try {
    const res = await fetch(url, {
      next: { revalidate },
      headers: { "User-Agent": "portfolio", Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Public, tokenless GitHub data for the activity section. Resilient to failures. */
export async function getGithubData(): Promise<GithubData> {
  const [profileRaw, contribRaw, reposRaw] = await Promise.all([
    safeJson(`https://api.github.com/users/${USER}`),
    safeJson(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`),
    safeJson(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`),
  ]);

  const profile = (profileRaw ?? null) as
    | { public_repos: number; followers: number; following: number }
    | null;

  const contributions: Contrib[] = Array.isArray(
    (contribRaw as { contributions?: Contrib[] } | null)?.contributions,
  )
    ? (contribRaw as { contributions: Contrib[] }).contributions
    : [];
  const totalContrib = contributions.reduce((a, c) => a + (c.count || 0), 0);

  const tally: Record<string, number> = {};
  if (Array.isArray(reposRaw)) {
    for (const r of reposRaw as { language: string | null; fork: boolean }[]) {
      if (r.fork || !r.language) continue;
      tally[r.language] = (tally[r.language] || 0) + 1;
    }
  }
  const totalLang = Object.values(tally).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(tally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, n]) => ({ name, pct: Math.round((n / totalLang) * 100) }));

  return {
    profile: profile
      ? {
          public_repos: profile.public_repos ?? 0,
          followers: profile.followers ?? 0,
          following: profile.following ?? 0,
        }
      : null,
    contributions,
    totalContrib,
    languages,
  };
}
