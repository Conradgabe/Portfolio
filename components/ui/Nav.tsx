"use client";

import { useEffect, useState } from "react";
import { Command as CommandIcon } from "lucide-react";
import { commands, site } from "@/lib/site";
import { openCommandPalette, smoothScrollTo } from "@/lib/scroll";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = commands.filter((c) =>
  ["cat about.md", "ls projects/", "ls posts/", "mail"].includes(c.cmd),
);

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300 print:hidden",
        scrolled ? "border-line bg-bg/80 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("#top");
          }}
          className="font-mono text-sm text-muted transition-colors hover:text-ink"
        >
          <span className="text-accent-ink">gabriel</span>
          <span className="text-faint">@portfolio</span>
        </a>

        <div className="flex items-center gap-1.5">
          <ul className="mr-2 hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((c) => (
              <li key={c.cmd}>
                <a
                  href={c.href}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo(c.href);
                  }}
                  className="px-2.5 py-1.5 font-mono text-[13px] text-muted transition-colors hover:text-ink"
                >
                  {c.label.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open command palette"
            className="flex h-9 items-center gap-2 border border-line px-2.5 font-mono text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <CommandIcon size={13} strokeWidth={1.75} />
            <span className="hidden sm:inline">K</span>
          </button>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

export function NavFooterEmail() {
  return <span>{site.email}</span>;
}
