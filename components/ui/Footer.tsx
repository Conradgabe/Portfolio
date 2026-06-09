import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 font-mono text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>
          © {year} {site.name} — {site.location}
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition-colors hover:text-accent-ink"
            >
              {s.label.toLowerCase()}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
