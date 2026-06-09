"use client";

import { ArrowDown } from "lucide-react";
import { site } from "@/lib/site";
import { useTypewriter } from "@/lib/hooks";
import { Cursor } from "@/components/terminal/Cursor";
import { smoothScrollTo, openCommandPalette } from "@/lib/scroll";

/**
 * Entrance is CSS-driven (.reveal-up / .reveal-slide) rather than JS/Motion so
 * the above-the-fold content — especially the name (LCP element) — paints
 * immediately and isn't gated behind hydration.
 */
export function Hero() {
  const tagline = site.taglines[0];
  const { out, done } = useTypewriter(tagline, { startDelay: 700, speed: 32 });

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Ambient phosphor glow + faded grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-[-12%] h-[460px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 78%)",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[90vh] max-w-5xl flex-col justify-center px-4 py-24 sm:px-6">
        <div className="space-y-5">
          <div
            className="reveal-up flex items-center gap-2 font-mono text-xs text-muted"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-ink" />
            </span>
            {site.available ? "available for work" : "currently heads-down"}
            <span className="text-faint">· {site.location}</span>
          </div>

          <div className="reveal-up font-mono text-sm text-muted" style={{ animationDelay: "0.12s" }}>
            <span className="text-accent-ink">$</span> whoami
          </div>

          <h1
            className="reveal-slide font-sans text-[clamp(2.6rem,8vw,5.5rem)] font-semibold leading-[0.94] tracking-tight text-ink"
            style={{ animationDelay: "0.16s" }}
          >
            {site.name}
          </h1>

          <p
            className="reveal-up font-mono text-base text-muted sm:text-lg"
            style={{ animationDelay: "0.24s" }}
          >
            {site.role} <span className="text-faint">·</span> {site.yearsExperience}+ years
          </p>

          <div
            className="reveal-up pt-2 font-mono text-sm text-muted"
            style={{ animationDelay: "0.32s" }}
          >
            <span className="text-accent-ink">$</span> cat tagline
            <div className="mt-1.5 min-h-[1.6em] text-base text-accent-ink sm:text-lg">
              <span className="text-faint">&gt; </span>
              {out}
              {!done && <Cursor />}
            </div>
          </div>

          <div
            className="reveal-up flex flex-wrap items-center gap-2 pt-5"
            style={{ animationDelay: "0.40s" }}
          >
            <HeroCmd onClick={() => smoothScrollTo("#projects")}>ls projects/</HeroCmd>
            <HeroCmd onClick={() => smoothScrollTo("#about")}>cat about.md</HeroCmd>
            <HeroCmd onClick={() => smoothScrollTo("#contact")}>mail</HeroCmd>
            <button
              onClick={openCommandPalette}
              className="px-2 py-2 font-mono text-xs text-faint transition-colors hover:text-muted"
            >
              or press ⌘K
            </button>
          </div>
        </div>
      </div>

      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          smoothScrollTo("#about");
        }}
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-faint transition-colors hover:text-muted sm:block"
      >
        <ArrowDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
}

function HeroCmd({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 border border-line bg-surface/40 px-3.5 py-2 font-mono text-[13px] text-muted transition-all hover:border-line-strong hover:text-ink"
    >
      <span className="text-accent-ink transition-transform group-hover:translate-x-0.5">$</span>
      {children}
    </button>
  );
}
