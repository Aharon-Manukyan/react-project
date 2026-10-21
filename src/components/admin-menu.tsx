"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChangePasswordForm } from "@/components/change-password-form";

export function AdminMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setModal(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.push("/login");
    router.refresh();
  }

  const item =
    "block w-full rounded-xl px-4 py-2 text-left text-sm hover:bg-bg disabled:opacity-60";

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm"
        >
          Аккаунт
          <span aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>

        {open ? (
          <div
            role="menu"
            className="absolute right-0 z-40 mt-2 w-56 rounded-2xl border border-line bg-bg-soft p-2 shadow-lg"
          >
            <button
              role="menuitem"
              type="button"
              className={item}
              onClick={() => {
                setOpen(false);
                setModal(true);
              }}
            >
              Изменить пароль
            </button>
            <button
              role="menuitem"
              type="button"
              className={`${item} text-ember`}
              disabled={loggingOut}
              onClick={logout}
            >
              {loggingOut ? "Выходим..." : "Выйти"}
            </button>
          </div>
        ) : null}
      </div>

      {modal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pw-title"
            className="w-full max-w-md rounded-[1.5rem] border border-line bg-bg-soft p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="pw-title" className="font-serif text-2xl">
                Смена пароля
              </h2>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setModal(false)}
                className="text-2xl leading-none text-muted"
              >
                ×
              </button>
            </div>
            <ChangePasswordForm />
          </div>
        </div>
      ) : null}
    </>
  );
}
