import { cn } from "@/lib/utils";

/** Prompt-style section heading: `$ command` + a large title + optional blurb. */
export function SectionHeading({
  command,
  title,
  index,
  blurb,
  className,
}: {
  command: string;
  title: string;
  index?: string;
  blurb?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 sm:mb-14", className)}>
      <div className="flex items-baseline justify-between gap-4 font-mono text-sm">
        <p className="text-muted">
          <span className="text-accent-ink">$</span> {command}
        </p>
        {index && <span className="text-faint">// {index}</span>}
      </div>
      <h2 className="mt-3 font-sans text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {blurb && (
        <p className="mt-3 max-w-xl font-sans text-[15px] leading-relaxed text-muted">{blurb}</p>
      )}
    </div>
  );
}
