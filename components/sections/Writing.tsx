import { ArrowUpRight } from "lucide-react";
import { getMediumPosts } from "@/lib/medium";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export async function Writing() {
  const posts = await getMediumPosts();

  return (
    <section id="writing" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <SectionHeading
            command="ls posts/"
            index="03"
            title="Writing"
            blurb="Notes on backend systems, Bitcoin, and building with AI — published on Medium."
          />
        </Reveal>

        {posts.length === 0 ? (
          <Reveal delay={0.05}>
            <div className="border border-line p-8 text-center">
              <p className="font-mono text-sm text-muted">
                <span className="text-accent-ink">$</span> ls posts/ —{" "}
                <span className="text-faint">no posts found</span>
              </p>
              <a
                href={`https://medium.com/@${site.githubUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-sm text-accent-ink hover:underline"
              >
                follow on Medium <ArrowUpRight size={14} />
              </a>
            </div>
          </Reveal>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {posts.map((post, i) => (
              <li key={post.link}>
                <Reveal delay={Math.min(i * 0.05, 0.3)}>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-2 py-5 transition-colors hover:bg-surface/50 sm:flex-row sm:items-center sm:gap-6 sm:px-2"
                  >
                    <span className="shrink-0 font-mono text-xs text-faint sm:w-28">{post.date}</span>
                    <span className="flex-1">
                      <span className="block font-sans text-lg font-medium leading-snug text-ink transition-colors group-hover:text-accent-ink">
                        {post.title}
                      </span>
                      {post.snippet && (
                        <span className="mt-1 block font-sans text-sm leading-relaxed text-muted">
                          {post.snippet}…
                        </span>
                      )}
                    </span>
                    <span className="flex shrink-0 items-center gap-3 font-mono text-xs text-faint">
                      <span>{post.readingMins} min</span>
                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink"
                      />
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
