import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Writing } from "@/components/sections/Writing";
import { GitHubActivity } from "@/components/sections/GitHubActivity";
import { Contact } from "@/components/sections/Contact";
import { HashScroll } from "@/components/ui/HashScroll";

function SectionFallback({ id, command }: { id: string; command: string }) {
  return (
    <section id={id} className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <p className="font-mono text-sm text-muted">
          <span className="text-accent-ink">$</span> {command}
        </p>
        <p className="mt-4 font-mono text-sm text-faint">// loading…</p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <HashScroll />
      <Hero />
      <Metrics />
      <About />
      <Projects />
      <Suspense fallback={<SectionFallback id="writing" command="ls posts/" />}>
        <Writing />
      </Suspense>
      <Suspense fallback={<SectionFallback id="github" command="git log --oneline" />}>
        <GitHubActivity />
      </Suspense>
      <Contact />
    </main>
  );
}
