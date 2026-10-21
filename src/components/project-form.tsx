"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@prisma/client";
import { COVER_TONES, PROJECT_STATUSES, statusLabel } from "@/lib/types";
import { PicturesField } from "@/components/pictures-field";

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pictures, setPictures] = useState<string[]>(project?.pictures ?? []);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title") ?? ""),
      slug: String(form.get("slug") ?? ""),
      summary: String(form.get("summary") ?? ""),
      description: String(form.get("description") ?? ""),
      stack: String(form.get("stack") ?? ""),
      status: String(form.get("status") ?? "concept"),
      year: Number(form.get("year") ?? new Date().getFullYear()),
      repoUrl: String(form.get("repoUrl") ?? ""),
      liveUrl: String(form.get("liveUrl") ?? ""),
      featured: form.get("featured") === "on",
      coverTone: String(form.get("coverTone") ?? "ember"),
    };

    const response = await fetch(
      project ? `/api/projects/${project.slug}` : "/api/projects",
      {
        method: project ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Не удалось сохранить");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function remove() {
    if (!project) return;
    if (!confirm("Удалить проект?")) return;
    await fetch(`/api/projects/${project.slug}`, { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название" name="title" defaultValue={project?.title} required />
        <Field label="Slug" name="slug" defaultValue={project?.slug} required />
      </div>
      <Field label="Короткое описание" name="summary" defaultValue={project?.summary} required />
      <label className="grid gap-2 text-sm">
        Полное описание
        <textarea
          required
          name="description"
          rows={6}
          defaultValue={project?.description}
          className="rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:border-gold"
        />
      </label>
      <Field
        label="Стек через запятую"
        name="stack"
        defaultValue={project?.stack}
        required
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm">
          Статус
          <select
            name="status"
            defaultValue={project?.status ?? "concept"}
            className="rounded-2xl border border-line bg-bg px-4 py-3 outline-none"
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Год"
          name="year"
          type="number"
          defaultValue={String(project?.year ?? new Date().getFullYear())}
        />
        <label className="grid gap-2 text-sm">
          Обложка
          <select
            name="coverTone"
            defaultValue={project?.coverTone ?? "ember"}
            className="rounded-2xl border border-line bg-bg px-4 py-3 outline-none"
          >
            {COVER_TONES.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="GitHub URL" name="repoUrl" defaultValue={project?.repoUrl ?? ""} />
        <Field label="Live URL" name="liveUrl" defaultValue={project?.liveUrl ?? ""} />
      </div>
      <PicturesField value={pictures} onChange={setPictures} />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured}
        />
        Показать на главной
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          disabled={loading}
          className="rounded-full bg-ember px-6 py-3 text-sm font-medium text-bg"
        >
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        {project ? (
          <button
            type="button"
            onClick={remove}
            className="rounded-full border border-line px-6 py-3 text-sm"
          >
            Удалить
          </button>
        ) : null}
      </div>
      {error ? <p className="text-ember">{error}</p> : null}
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <input
        required={required}
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:border-gold"
      />
    </label>
  );
}
