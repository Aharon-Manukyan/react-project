"use client";

import { useRef, useState } from "react";

async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Не удалось сжать"))),
      "image/webp",
      0.82,
    ),
  );
}

export function PicturesField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    const added: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const blob = await compress(file);
        const body = new FormData();
        body.append("file", new File([blob], "image.webp", { type: "image/webp" }));
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error ?? "Ошибка загрузки");
        added.push(data.url);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    }
    if (added.length) onChange([...value, ...added]);
    if (input.current) input.current.value = "";
    setBusy(false);
  }

  function move(i: number, dir: -1 | 1) {
    const next = [...value];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="grid gap-3 text-sm">
      <span>Фотографии (первая будет обложкой)</span>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        onChange={(e) => onFiles(e.target.files)}
      />
      {busy ? <p>Загрузка...</p> : null}
      {error ? <p className="text-ember">{error}</p> : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((src, i) => (
          <div key={src} className="grid gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
            <div className="flex justify-between">
              <button type="button" onClick={() => move(i, -1)}>
                ←
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))}>
                Удалить
              </button>
              <button type="button" onClick={() => move(i, 1)}>
                →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
