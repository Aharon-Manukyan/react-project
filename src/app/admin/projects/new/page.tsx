import { redirect } from "next/navigation";
import { ProjectForm } from "@/components/project-form";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  if (!(await isAdmin())) redirect("/login");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl">Новый проект</h1>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </main>
  );
}
