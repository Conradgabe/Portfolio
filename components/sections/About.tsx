import { site, focusAreas } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <SectionHeading command="cat about.md" index="01" title="About" />
        </Reveal>

        {/* Bio: rendered as readable long-form, with a phosphor margin rule */}
        <Reveal delay={0.05}>
          <div className="max-w-2xl border-l border-line pl-5 sm:pl-6">
            {site.bio.map((para, i) => (
              <p
                key={i}
                className="mb-4 font-sans text-[15px] leading-relaxed text-muted sm:text-base [&:last-child]:mb-0"
              >
                {para}
              </p>
            ))}
          </div>
        </Reveal>

        {/* Focus areas */}
        <div className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:mt-20 sm:grid-cols-2">
          {focusAreas.map((area, i) => (
            <Reveal key={area.key} delay={i * 0.06} className="bg-bg">
              <article className="h-full p-6 transition-colors hover:bg-surface sm:p-7">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-sans text-lg font-medium tracking-tight text-ink">
                    {area.title}
                  </h3>
                  <span className="font-mono text-[11px] text-faint">0{i + 1}</span>
                </div>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{area.blurb}</p>
                <ul className="mt-4 space-y-1.5">
                  {area.items.map((item) => (
                    <li key={item} className="flex gap-2 font-mono text-xs text-faint">
                      <span className="text-accent-ink">›</span>
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
