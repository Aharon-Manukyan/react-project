import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { MessageActions } from "@/components/message-actions";
import { StatusBadge } from "@/components/status-badge";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [projects, messages, unread] = await Promise.all([
    prisma.project.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.message.count({ where: { read: false } }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.28em] text-gold uppercase">
            Dashboard
          </p>
          <h1 className="mt-2 font-serif text-4xl">Кабинет студии</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/projects/new"
            className="rounded-full bg-ember px-5 py-2 text-sm text-bg"
          >
            Новый проект
          </Link>
          <LogoutButton />
        </div>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <Stat label="Проекты" value={String(projects.length)} />
        <Stat label="Заявки" value={String(messages.length)} />
        <Stat label="Непрочитанные" value={String(unread)} />
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-3xl">Кейсы</h2>
        <div className="mt-4 divide-y divide-line rounded-[1.5rem] border border-line">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div>
                <p className="font-medium">{project.title}</p>
                <p className="text-sm text-muted">/{project.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={project.status} />
                <Link
                  href={`/admin/projects/${project.slug}`}
                  className="text-sm text-gold"
                >
                  Править
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 mb-8">
        <h2 className="font-serif text-3xl">Входящие</h2>
        <div className="mt-4 grid gap-4">
          {messages.length === 0 ? (
            <p className="text-muted">Пока нет заявок.</p>
          ) : (
            messages.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.5rem] border border-line bg-bg-soft p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted">
                      {item.email}
                      {item.company ? ` · ${item.company}` : ""}
                    </p>
                  </div>
                  <MessageActions id={item.id} read={item.read} />
                </div>
                <p className="mt-3 text-sm leading-6">{item.body}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-line bg-bg-soft p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
    </div>
  );
}
