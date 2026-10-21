"use client";

import { FormEvent, useState } from "react";

export function ChangePasswordForm() {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword") ?? "");
    const newPassword = String(data.get("newPassword") ?? "");
    const repeat = String(data.get("repeat") ?? "");

    setError("");
    setDone(false);
    if (newPassword !== repeat) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setLoading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "Ошибка сервера, попробуйте позже");
      return;
    }
    form.reset();
    setDone(true);
  }

  const input = "rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:border-gold";

  return (
    <form onSubmit={onSubmit} className="grid max-w-md gap-4">
      <label className="grid gap-2 text-sm">
        Текущий пароль
        <input
          required
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          className={input}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Новый пароль (от 12 символов)
        <input
          required
          minLength={12}
          type="password"
          name="newPassword"
          autoComplete="new-password"
          className={input}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Повторите новый пароль
        <input
          required
          minLength={12}
          type="password"
          name="repeat"
          autoComplete="new-password"
          className={input}
        />
      </label>
      <button
        disabled={loading}
        className="rounded-full bg-ember px-6 py-3 text-sm font-medium text-bg"
      >
        {loading ? "Сохраняем..." : "Сменить пароль"}
      </button>
      {error ? <p className="text-ember">{error}</p> : null}
      {done ? <p className="text-gold">Пароль изменён. Остальные сессии завершены.</p> : null}
    </form>
  );
}
