import { notFound, redirect } from "next/navigation";
import { ProjectForm } from "@/components/project-form";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[slug]">) {
  if (!(await isAdmin())) redirect("/login");
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl">Редактировать {project.title}</h1>
      <div className="mt-8">
        <ProjectForm project={project} />
      </div>
    </main>
  );
}
