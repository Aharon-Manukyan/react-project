import Link from "next/link";
import { Project } from "@prisma/client";
import { Cover } from "./cover";
import { StatusBadge } from "./status-badge";
import { parseStack } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const stack = parseStack(project.stack).slice(0, 4);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col gap-4 rounded-[1.75rem] border border-line bg-bg-soft/70 p-4 transition hover:-translate-y-0.5 hover:border-gold/40"
    >
      <Cover tone={project.coverTone} title={project.title} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">
            {project.year}
          </p>
          <h3 className="mt-1 font-serif text-2xl">{project.title}</h3>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-sm leading-6 text-muted">{project.summary}</p>
      <div className="flex flex-wrap gap-2">
        {stack.map((item) => (
          <span
            key={item}
            className="rounded-full border border-line px-2.5 py-1 text-[11px] text-paper/80"
          >
            {item}
          </span>
        ))}
      </div>
    </Link>
  );
}
