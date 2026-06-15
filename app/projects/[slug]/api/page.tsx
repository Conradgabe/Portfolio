import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/site";
import { apiDocs, graphqlSdl, graphqlExamples } from "@/lib/api-docs";
import { openApiSpecs, sidecarSpecs, countOperations } from "@/lib/specs";
import { OpenApiView } from "@/components/sections/OpenApiView";
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
    title: `${project.name} · API reference`,
    description: `Full API reference for ${project.name}.`,
  };
}

/** A labelled, scrollable code panel in the site's terminal style. */
function CodePanel({ label, code }: { label: string; code: string }) {
  return (
    <figure className="overflow-hidden border border-line">
      <figcaption className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2 font-mono text-[11px] text-faint">
        <span className="text-accent-ink">›</span> {label}
      </figcaption>
      <pre className="overflow-x-auto bg-bg p-4 font-mono text-[12.5px] leading-relaxed text-muted">
        <code>{code}</code>
      </pre>
    </figure>
  );
}

export default async function ApiSpecPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const doc = apiDocs[slug];
  if (!project || !doc) notFound();

  return (
    <main id="main" className="flex-1">
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <Link
          href={`/projects/${slug}`}
          className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent-ink"
        >
          <ArrowLeft size={14} /> cd ../{slug}
        </Link>

        <Reveal>
          <header className="mt-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-faint">
              <span className="text-accent-ink">API reference</span>
              <span>·</span>
              <span>{doc.protocol}</span>
              {doc.endpoint && (
                <>
                  <span>·</span>
                  <span>{doc.endpoint}</span>
                </>
              )}
            </div>
            <h1 className="mt-4 font-sans text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {project.name}
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-lg leading-relaxed text-muted">{doc.intro}</p>
            {doc.note && (
              <p className="mt-2 max-w-2xl font-mono text-[11px] leading-relaxed text-faint">// {doc.note}</p>
            )}
          </header>
        </Reveal>

        {doc.kind === "graphql" ? (
          <div className="mt-12 space-y-8">
            <Reveal>
              <section>
                <h2 className="mb-3 font-mono text-sm text-muted">
                  <span className="text-accent-ink">$</span> cat schema.graphql
                </h2>
                <CodePanel label="schema.graphql" code={graphqlSdl} />
              </section>
            </Reveal>
            <Reveal delay={0.05}>
              <section>
                <h2 className="mb-3 font-mono text-sm text-muted">
                  <span className="text-accent-ink">$</span> cat examples/queries.graphql
                </h2>
                <CodePanel label="examples/queries.graphql" code={graphqlExamples.queries} />
              </section>
            </Reveal>
            <Reveal delay={0.05}>
              <section>
                <h2 className="mb-3 font-mono text-sm text-muted">
                  <span className="text-accent-ink">$</span> cat examples/mutations.graphql
                </h2>
                <CodePanel label="examples/mutations.graphql" code={graphqlExamples.mutations} />
              </section>
            </Reveal>
            {project.repoUrl && (
              <Reveal delay={0.05}>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  view source on GitHub <ArrowUpRight size={13} />
                </a>
              </Reveal>
            )}
          </div>
        ) : doc.kind === "rest" && openApiSpecs[slug] ? (
          <div className="mt-12 space-y-10">
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-3 border border-line bg-surface px-4 py-3">
                <div className="font-mono text-[12px] text-muted">
                  <span className="text-ink">{openApiSpecs[slug].info.title}</span>{" "}
                  <span className="text-faint">v{openApiSpecs[slug].info.version}</span> · OpenAPI{" "}
                  {openApiSpecs[slug].openapi} · {countOperations(openApiSpecs[slug])} endpoints
                </div>
                <a
                  href={`/api-specs/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-line px-3 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  download openapi.json <ArrowUpRight size={12} />
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <OpenApiView spec={openApiSpecs[slug]} />
            </Reveal>

            {sidecarSpecs[slug] && (
              <Reveal>
                <section className="border-t border-line pt-10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-sans text-2xl font-semibold tracking-tight text-ink">
                        Sidecar · {sidecarSpecs[slug].info.title}
                      </h2>
                      <p className="mt-1 max-w-2xl font-sans text-[14px] leading-relaxed text-muted">
                        {sidecarSpecs[slug].info.description} The main API calls this internal service to
                        burn in branded intros/outros, hook overlays, and karaoke captions.
                      </p>
                    </div>
                    <a
                      href={`/api-specs/${slug}-renderer`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-2 border border-line px-3 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                    >
                      download openapi.json <ArrowUpRight size={12} />
                    </a>
                  </div>
                  <div className="mt-6">
                    <OpenApiView spec={sidecarSpecs[slug]} />
                  </div>
                </section>
              </Reveal>
            )}
          </div>
        ) : (
          <Reveal>
            <div className="mt-12 border border-dashed border-line px-6 py-10 text-center">
              <p className="font-mono text-sm text-muted">
                {doc.kind === "pending"
                  ? doc.pending?.note
                  : "The full reference for this project lives in its source repository."}
              </p>
              {doc.spec && (doc.spec.type === "source" || doc.spec.type === "openapi") && (
                <a
                  href={doc.spec.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  {doc.spec.label} <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </Reveal>
        )}
      </article>
    </main>
  );
}
