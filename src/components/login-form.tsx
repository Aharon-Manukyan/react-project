"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const password = String(new FormData(event.currentTarget).get("password") ?? "");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Ошибка входа");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm">
        Пароль администратора
        <input
          required
          type="password"
          name="password"
          className="rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:border-gold"
        />
      </label>
      <button
        disabled={loading}
        className="rounded-full bg-ember px-6 py-3 text-sm font-medium text-bg"
      >
        {loading ? "Входим..." : "Войти"}
      </button>
      {error ? <p className="text-ember">{error}</p> : null}
    </form>
  );
}
