import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover } from "@/components/cover";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/db";
import { parseStack } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/projects" className="text-sm text-gold">
        ← К кейсам
      </Link>
      {
        <div className="mt-6">
          <Cover tone={project.coverTone} title={project.title} pictures={project.pictures || []} />
        </div>
      }

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <StatusBadge status={project.status} />
        <span className="text-sm text-muted">{project.year}</span>
      </div>
      <h1 className="mt-4 font-serif text-5xl">{project.title}</h1>
      <p className="mt-4 text-lg text-muted">{project.summary}</p>
      <p className="mt-8 leading-7 whitespace-pre-wrap text-paper/90">{project.description}</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {parseStack(project.stack).map((item) => (
          <span key={item} className="rounded-full border border-line px-3 py-1 text-sm">
            {item}
          </span>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            className="rounded-full border border-line px-5 py-2 text-sm"
            target="_blank"
            rel="noreferrer"
          >
            Behance
          </a>
        ) : null}
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            className="fa-brands fa-instagram rounded-full bg-ember px-5 py-2 text-sm text-bg"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        ) : null}
      </div>
    </main>
  );
}
