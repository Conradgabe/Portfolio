import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/lib/site";
import { ProjectMock } from "@/components/mocks/ProjectMock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Projects() {
  return (
    <section id="projects" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <SectionHeading
            command="ls projects/"
            index="02"
            title="Selected work"
            blurb="Things I've designed and built: AI pipelines, a quant engine, backend platforms, and developer tools. Forks excluded; private repos shown as case studies."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.06}>
              <ProjectCard project={p} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col border border-line bg-bg transition-colors hover:border-line-strong focus-visible:border-line-strong"
    >
      <div className="overflow-hidden border-b border-line">
        <div className="transition-transform duration-500 group-hover:scale-[1.015]">
          {project.images && project.images.length > 0 ? (
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={project.images[0].src}
                alt={project.images[0].alt}
                fill
                sizes="(max-width: 640px) 100vw, 520px"
                className="object-cover object-top"
              />
            </div>
          ) : (
            <ProjectMock type={project.mock} className="border-0" />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between font-mono text-[11px] text-faint">
          <span>
            {String(index).padStart(2, "0")} · {project.category}
          </span>
          <span className="uppercase tracking-wider">{project.visibility}</span>
        </div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="font-sans text-xl font-semibold tracking-tight text-ink">{project.name}</h3>
          <ArrowUpRight
            size={18}
            className="mt-1 shrink-0 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink"
          />
        </div>
        <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{project.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <li key={s} className="border border-line px-2 py-0.5 font-mono text-[10px] text-faint">
              {s}
            </li>
          ))}
          {project.stack.length > 4 && (
            <li className="px-1 py-0.5 font-mono text-[10px] text-faint">
              +{project.stack.length - 4}
            </li>
          )}
        </ul>
      </div>
    </Link>
  );
}
