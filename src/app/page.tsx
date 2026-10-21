import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { ProjectCard } from "@/components/project-card";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { year: "desc" },
    take: 3,
  });

  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs tracking-[0.28em] text-gold uppercase">
            Full-stack · Next.js · Prisma
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Atelier — студия, которую можно открыть и пощупать.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
            Портфолио с живой базой, публичным API и админкой. Не лендинг-макет:
            заявки сохраняются, кейсы редактируются, стек настоящий.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-full bg-ember px-6 py-3 text-sm font-medium text-bg"
            >
              Смотреть кейсы
            </Link>
            <Link
              href="/api/projects"
              className="rounded-full border border-line px-6 py-3 text-sm"
            >
              JSON API
            </Link>
          </div>
        </div>
        <aside className="rounded-[2rem] border border-line bg-bg-soft p-6">
          <p className="text-sm text-muted">Что внутри</p>
          <ul className="mt-4 grid gap-3 text-sm">
            <li>App Router + Server Components</li>
            <li>REST Route Handlers и Zod</li>
            <li>SQLite через Prisma</li>
            <li>Cookie-сессия администратора</li>
          </ul>
        </aside>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-4xl">Избранные работы</h2>
          <Link href="/projects" className="text-sm text-gold">
            Все проекты
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 lg:grid-cols-2"
      >
        <div>
          <h2 className="font-serif text-4xl">Давайте поговорим о проекте</h2>
          <p className="mt-4 max-w-md text-muted">
            Форма пишет в базу. Откройте кабинет администратора и увидите заявку
            без почтового сервиса.
          </p>
        </div>
        <div className="rounded-[2rem] border border-line bg-bg-soft p-6">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
