"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setStatus("error");
      setMessage(payload.error ?? "Не удалось отправить");
      return;
    }

    form.reset();
    setStatus("ok");
    setMessage("Сообщение отправлено. Оно появится в админке.");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Имя
          <input
            required
            name="name"
            className="rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Email
          <input
            required
            type="email"
            name="email"
            className="rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:border-gold"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        Компания
        <input
          name="company"
          className="rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:border-gold"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Сообщение
        <textarea
          required
          name="body"
          rows={5}
          className="resize-none rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:border-gold"
        />
      </label>
      <button
        disabled={status === "loading"}
        className="rounded-full bg-ember px-6 py-3 text-sm font-medium text-bg disabled:opacity-60"
      >
        {status === "loading" ? "Отправка..." : "Отправить заявку"}
      </button>
      {message ? <p className={status === "ok" ? "text-sage" : "text-ember"}>{message}</p> : null}
    </form>
  );
}
