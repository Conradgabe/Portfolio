import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import type { ApiDoc, ApiExample, ApiOperation } from "@/lib/api-docs";
import { Reveal } from "@/components/ui/Reveal";

/** Monospace tag chip — monochrome by design, differentiated by border + opacity only. */
function Tag({ tag }: { tag: ApiOperation["tag"] }) {
  return (
    <span className="inline-flex shrink-0 items-center border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint">
      {tag}
    </span>
  );
}

function Operation({ op }: { op: ApiOperation }) {
  return (
    <div className="flex gap-3 p-4">
      <Tag tag={op.tag} />
      <div className="min-w-0">
        <p className="font-mono text-[13px] text-ink">{op.name}</p>
        <p className="mt-1 font-sans text-[13px] leading-relaxed text-muted">{op.summary}</p>
        {op.fields && op.fields.length > 0 && (
          <ul className="mt-2 space-y-0.5">
            {op.fields.map((f) => (
              <li key={f} className="font-mono text-[11px] leading-relaxed text-faint">
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Example({ ex }: { ex: ApiExample }) {
  return (
    <figure className="overflow-hidden border border-line">
      <figcaption className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2 font-mono text-[11px] text-faint">
        <span className="text-accent-ink">›</span> {ex.label}
      </figcaption>
      <pre className="overflow-x-auto bg-bg p-4 font-mono text-[12px] leading-relaxed text-muted">
        <code>{ex.code}</code>
      </pre>
      {ex.response && (
        <>
          <div className="border-t border-line bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">
            response
          </div>
          <pre className="overflow-x-auto bg-bg p-4 font-mono text-[12px] leading-relaxed text-muted">
            <code>{ex.response}</code>
          </pre>
        </>
      )}
    </figure>
  );
}

/** Terminal-styled API reference rendered inside a project case study. */
export function ApiReference({ doc }: { doc: ApiDoc }) {
  return (
    <section className="mt-14">
      <Reveal>
        <h2 className="font-mono text-sm text-muted">
          <span className="text-accent-ink">$</span> cat api.md
        </h2>

        {/* meta chips */}
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-faint">
          <span className="text-muted">{doc.protocol}</span>
          {doc.endpoint && (
            <>
              <span>·</span>
              <span className="text-accent-ink">{doc.endpoint}</span>
            </>
          )}
          <span>·</span>
          <span>auth: {doc.auth}</span>
        </div>

        <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">{doc.intro}</p>
        {doc.note && <p className="mt-2 max-w-2xl font-mono text-[11px] leading-relaxed text-faint">// {doc.note}</p>}
      </Reveal>

      {doc.kind === "pending" ? (
        <Reveal delay={0.05}>
          <div className="mt-6 flex items-center gap-3 border border-dashed border-line px-4 py-4 font-mono text-[13px] text-faint">
            <Lock size={14} className="shrink-0" />
            <span>{doc.pending?.note}</span>
          </div>
        </Reveal>
      ) : (
        <>
          {doc.groups.map((group, gi) => (
            <Reveal key={group.title} delay={0.04 + gi * 0.04}>
              <div className="mt-8">
                <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {group.title}
                </h3>
                {group.caption && (
                  <p className="mt-1 font-sans text-[13px] text-faint">{group.caption}</p>
                )}
                <div className="mt-3 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
                  {group.operations.map((op) => (
                    <div key={op.name} className="bg-bg">
                      <Operation op={op} />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}

          {doc.examples && doc.examples.length > 0 && (
            <Reveal delay={0.06}>
              <div className="mt-8">
                <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">Examples</h3>
                <div className="mt-3 grid gap-5 lg:grid-cols-2">
                  {doc.examples.map((ex) => (
                    <Example key={ex.label} ex={ex} />
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </>
      )}

      {doc.spec && (
        <Reveal delay={0.06}>
          <div className="mt-6">
            {doc.spec.type === "source" || doc.spec.type === "openapi" ? (
              <a
                href={doc.spec.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                {doc.spec.label} <ArrowUpRight size={13} />
              </a>
            ) : (
              <Link
                href={doc.spec.href}
                className="inline-flex items-center gap-2 border border-line px-3 py-2 font-mono text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                {doc.spec.label} →
              </Link>
            )}
          </div>
        </Reveal>
      )}
    </section>
  );
}
