import { metrics } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

/** Compact impact band under the hero — four real numbers, terminal-grid styling. */
export function Metrics() {
  return (
    <section id="impact" aria-label="Impact metrics" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.05} className="bg-bg">
              <div className="flex h-full flex-col p-6 sm:p-7">
                <dd className="order-1 font-sans text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {m.value}
                </dd>
                <dt className="order-2 mt-1.5 font-mono text-[11px] leading-relaxed text-faint">
                  {m.label}
                </dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
