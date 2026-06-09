import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Code2, Lock } from "lucide-react";
import { projects } from "@/lib/site";
import { ProjectMock } from "@/components/mocks/ProjectMock";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — ${project.category}`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();

  const next = projects[(index + 1) % projects.length];

  return (
    <main id="main" className="flex-1">
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent-ink"
        >
          <ArrowLeft size={14} /> cd ../projects
        </Link>

        <Reveal>
          <header className="mt-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-faint">
              <span className="text-accent-ink">{project.category}</span>
              <span>·</span>
              <span>{project.year}</span>
              <span>·</span>
              <span className="uppercase tracking-wider">{project.visibility} repository</span>
              {project.repoName && project.repoName !== project.name && (
                <>
                  <span>·</span>
                  <span>repo: {project.repoName}</span>
                </>
              )}
            </div>
            <h1 className="mt-4 font-sans text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {project.name}
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-lg leading-relaxed text-muted">
              {project.tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  <Code2 size={14} /> view source <ArrowUpRight size={13} />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[13px] text-faint">
                  <Lock size={13} /> private repository
                </span>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  live <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </header>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-10">
            <ProjectMock type={project.mock} />
            <p className="mt-2 text-right font-mono text-[11px] text-faint">
              // illustrative mock — real screenshots coming soon
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <p className="mt-12 max-w-2xl font-sans text-base leading-relaxed text-ink/90 sm:text-lg">
            {project.summary}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 sm:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <section>
              <h2 className="font-mono text-sm text-muted">
                <span className="text-accent-ink">$</span> cat problem.md
              </h2>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-muted">{project.problem}</p>
            </section>
          </Reveal>
          <Reveal delay={0.06}>
            <section>
              <h2 className="font-mono text-sm text-muted">
                <span className="text-accent-ink">$</span> whoami --role
              </h2>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-muted">{project.role}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <li key={s} className="border border-line px-2 py-0.5 font-mono text-[10px] text-faint">
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>

        <Reveal>
          <section className="mt-14">
            <h2 className="font-mono text-sm text-muted">
              <span className="text-accent-ink">$</span> cat approach.md
            </h2>
            <ol className="mt-5 space-y-3">
              {project.approach.map((step, i) => (
                <li key={i} className="flex gap-4 border-l border-line pl-4">
                  <span className="font-mono text-xs text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-sans text-[15px] leading-relaxed text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-14">
            <h2 className="font-mono text-sm text-muted">
              <span className="text-accent-ink">$</span> ls highlights/
            </h2>
            <div className="mt-5 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
              {project.highlights.map((h) => (
                <div key={h} className="bg-bg p-4 font-mono text-sm text-muted">
                  <span className="text-accent-ink">›</span> {h}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <nav className="mt-16 flex items-center justify-between border-t border-line pt-6">
            <Link
              href="/#projects"
              className="font-mono text-sm text-muted transition-colors hover:text-accent-ink"
            >
              ← all projects
            </Link>
            <Link
              href={`/projects/${next.slug}`}
              className="group text-right font-mono text-sm text-muted transition-colors hover:text-accent-ink"
            >
              <span className="block text-[11px] text-faint">next</span>
              {next.name} →
            </Link>
          </nav>
        </Reveal>
      </article>
    </main>
  );
}
