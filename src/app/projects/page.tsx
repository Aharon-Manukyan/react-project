import { ProjectCard } from "@/components/project-card";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ year: "desc" }, { title: "asc" }],
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs tracking-[0.28em] text-gold uppercase">Archive</p>
      <h1 className="mt-3 font-serif text-5xl">Все кейсы</h1>
      <p className="mt-4 max-w-xl text-muted">
        Данные приходят из SQLite. Добавить новый кейс можно в админке.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
