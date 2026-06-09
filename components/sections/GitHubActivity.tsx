import { ArrowUpRight } from "lucide-react";
import { getGithubData } from "@/lib/github";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const LEVELS = ["bg-line", "bg-accent/30", "bg-accent/50", "bg-accent/75", "bg-accent"];

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function GitHubActivity() {
  const data = await getGithubData();
  const recent = data.contributions.slice(-364);
  const weeks = chunk(recent, 7);

  const stats = [
    { label: "contributions", value: data.totalContrib ? data.totalContrib.toLocaleString() : "—" },
    { label: "public repos", value: data.profile ? String(data.profile.public_repos) : "—" },
    { label: "followers", value: data.profile ? String(data.profile.followers) : "—" },
  ];

  return (
    <section id="github" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <SectionHeading
            command="git log --oneline"
            index="04"
            title="GitHub activity"
            blurb="Public contributions and the languages I reach for most. Private work isn't shown here."
          />
        </Reveal>

        <div className="overflow-hidden border border-line">
          {/* Top: heatmap | languages */}
          <div className="grid gap-px bg-line lg:grid-cols-[1.6fr_1fr]">
            <Reveal className="min-w-0 bg-bg">
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm text-muted">contribution graph</h3>
                  <span className="font-mono text-xs text-faint">last 12 months</span>
                </div>
                {weeks.length > 0 ? (
                  <div className="mt-5 overflow-x-auto pb-2">
                    <div
                      className="flex gap-[3px]"
                      role="img"
                      aria-label={`${data.totalContrib} GitHub contributions in the last year`}
                    >
                      {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[3px]">
                          {week.map((day) => (
                            <span
                              key={day.date}
                              title={`${day.date}: ${day.count}`}
                              className={cn("h-[11px] w-[11px] rounded-[2px]", LEVELS[day.level] ?? LEVELS[0])}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 font-mono text-sm text-faint">
                    // live contribution data unavailable right now
                  </p>
                )}
                <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-faint">
                  <span>less</span>
                  {LEVELS.map((l, i) => (
                    <span key={i} className={cn("h-[10px] w-[10px] rounded-[2px]", l)} />
                  ))}
                  <span>more</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06} className="min-w-0 bg-bg">
              <div className="flex h-full flex-col gap-5 p-6 sm:p-7">
                <div>
                  <h3 className="font-mono text-sm text-muted">top languages</h3>
                  <ul className="mt-4 space-y-2.5">
                    {data.languages.length > 0 ? (
                      data.languages.map((lang) => (
                        <li key={lang.name}>
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span className="text-muted">{lang.name}</span>
                            <span className="text-faint">{lang.pct}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full bg-line">
                            <div className="h-full bg-accent-ink/60" style={{ width: `${lang.pct}%` }} />
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="font-mono text-xs text-faint">// unavailable</li>
                    )}
                  </ul>
                </div>

                <a
                  href={site.socials[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 font-mono text-sm text-accent-ink hover:underline"
                >
                  github.com/{site.githubUser} <ArrowUpRight size={14} />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Bottom: full-width stat row */}
          <div className="grid grid-cols-3 gap-px border-t border-line bg-line">
            {stats.map((s) => (
              <div key={s.label} className="bg-bg px-3 py-7 text-center">
                <div className="font-sans text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1.5 font-mono text-[11px] text-faint">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
