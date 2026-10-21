"use client";

import { useRouter } from "next/navigation";

export function MessageActions({ id, read }: { id: string; read: boolean }) {
  const router = useRouter();

  async function toggle() {
    await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !read }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-gold"
    >
      {read ? "Снять прочтение" : "Отметить прочитанным"}
    </button>
  );
}
