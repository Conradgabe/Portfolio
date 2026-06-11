import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { site, projects, skills, focusAreas } from "@/lib/site";
import { resumeSummary, experience, education, certifications } from "@/lib/resume";
import { getMediumPosts } from "@/lib/medium";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${site.name}, ${site.role} based in ${site.location}.`,
};

export default async function ResumePage() {
  const posts = (await getMediumPosts()).slice(0, 4);

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 print:py-0">
        <div className="no-print mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent-ink"
          >
            <ArrowLeft size={14} /> cd ..
          </Link>
          <a
            href="/Gabriel-Isuekebho-Resume.pdf"
            download
            className="inline-flex items-center gap-2 border border-line-strong bg-accent/10 px-3.5 py-2 font-mono text-[13px] text-ink transition-colors hover:bg-accent/20"
          >
            <Download size={14} /> download PDF
          </a>
        </div>

        <article className="space-y-9">
          <header className="border-b border-line pb-6">
            <h1 className="font-sans text-4xl font-semibold tracking-tight text-ink">{site.name}</h1>
            <p className="mt-1 font-mono text-sm text-muted">
              {site.role} · {site.location}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted">
              <a href={`mailto:${site.email}`} className="hover:text-accent-ink">
                {site.email}
              </a>
              {site.socials
                .filter((s) => s.label !== "Email")
                .map((s) => (
                  <a key={s.label} href={s.href} className="hover:text-accent-ink">
                    {s.handle}
                  </a>
                ))}
            </div>
          </header>

          <Section title="Summary">
            <p className="font-sans text-sm leading-relaxed text-muted">{resumeSummary}</p>
          </Section>

          <Section title="Core Expertise">
            <ul className="grid gap-3 sm:grid-cols-2">
              {focusAreas.map((a) => (
                <li key={a.key}>
                  <span className="font-sans text-sm font-medium text-ink">{a.title}</span>
                  <span className="mt-0.5 block font-mono text-[11px] leading-relaxed text-muted">
                    {a.items.slice(0, 2).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Selected Projects">
            <ul className="space-y-4">
              {projects.map((p) => (
                <li key={p.slug}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-sans text-sm font-medium text-ink">{p.name}</span>
                    <span className="shrink-0 font-mono text-[11px] text-faint">
                      {p.category} · {p.year}
                    </span>
                  </div>
                  <p className="mt-0.5 font-sans text-sm leading-relaxed text-muted">{p.tagline}</p>
                  <p className="mt-1 font-mono text-[11px] text-faint">{p.stack.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Experience">
            {experience.length > 0 ? (
              <ul className="space-y-5">
                {experience.map((job, i) => (
                  <li key={i}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-sans text-sm font-medium text-ink">
                        {job.role} · {job.org}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-faint">{job.period}</span>
                    </div>
                    <ul className="mt-1.5 space-y-1">
                      {job.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2 font-sans text-sm text-muted">
                          <span className="text-accent-ink">›</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <Placeholder note="Work history to be added, send me roles, companies, and dates." />
            )}
          </Section>

          <div className="grid gap-9 sm:grid-cols-2">
            <Section title="Education">
              {education.length > 0 ? (
                <ul className="space-y-3">
                  {education.map((e, i) => (
                    <li key={i}>
                      <span className="block font-sans text-sm font-medium text-ink">{e.credential}</span>
                      <span className="font-mono text-[11px] text-muted">
                        {e.school} · {e.period}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Placeholder note="Education to be added." />
              )}
            </Section>

            <Section title="Certifications">
              {certifications.length > 0 ? (
                <ul className="space-y-1.5 font-mono text-xs text-muted">
                  {certifications.map((c) => (
                    <li key={c}>· {c}</li>
                  ))}
                </ul>
              ) : (
                <Placeholder note="Certifications to be added." />
              )}
            </Section>
          </div>

          <Section title="Technical Skills">
            <dl className="space-y-2">
              {skills.map((g) => (
                <div key={g.group} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                  <dt className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-wider text-faint">
                    {g.group}
                  </dt>
                  <dd className="font-mono text-xs text-muted">{g.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {posts.length > 0 && (
            <Section title="Selected Writing">
              <ul className="space-y-1.5">
                {posts.map((p) => (
                  <li key={p.link} className="flex justify-between gap-3 font-mono text-[11px]">
                    <span className="text-muted">{p.title}</span>
                    <span className="shrink-0 text-faint">{p.date}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </article>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">{title}</h2>
      {children}
    </section>
  );
}

function Placeholder({ note }: { note: string }) {
  return (
    <p className="border border-dashed border-line px-3 py-2 font-mono text-[11px] text-faint">
      // {note}
    </p>
  );
}
