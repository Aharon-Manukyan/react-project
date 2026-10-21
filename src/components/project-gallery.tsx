"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function ProjectGallery({
  pictures,
  title,
}: {
  pictures: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [nativeFull, setNativeFull] = useState(false);
  const [fallbackFull, setFallbackFull] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  const count = pictures.length;
  const full = nativeFull || fallbackFull;

  const go = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count],
  );

  const toggleFull = useCallback(async () => {
    const el = box.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (fallbackFull) {
      setFallbackFull(false);
      return;
    }
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        return;
      } catch {
        /* переходим к запасному варианту */
      }
    }
    // iPhone и другие браузеры без Fullscreen API
    setFallbackFull(true);
  }, [fallbackFull]);

  // Следим за системным полноэкранным режимом (в том числе выход по Esc)
  useEffect(() => {
    const onChange = () =>
      setNativeFull(document.fullscreenElement === box.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Клавиатура: работает в полноэкранном режиме или когда фокус внутри карусели
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = full || box.current?.contains(document.activeElement);
      if (!active) return;
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "Escape" && fallbackFull) setFallbackFull(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full, fallbackFull, index, go]);

  // Блокируем прокрутку страницы в запасном полноэкранном режиме
  useEffect(() => {
    if (!fallbackFull) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [fallbackFull]);

  // Прокручиваем миниатюры к выбранной
  useEffect(() => {
    const el = thumbs.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [index]);

  if (count === 0) return null;

  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
  }

  function onPointerUp(e: React.PointerEvent) {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) {
      go(dx < 0 ? index + 1 : index - 1);
    } else if (Math.abs(dx) < 10 && !full) {
      toggleFull(); // тап по фото открывает на весь экран
    }
  }

  const arrow =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-2xl text-white transition hover:bg-black/70";

  return (
    <div
      ref={box}
      tabIndex={0}
      className={
        full
          ? `flex h-full w-full flex-col gap-3 bg-black p-4 outline-none ${
              fallbackFull ? "fixed inset-0 z-50" : ""
            }`
          : "grid gap-3 outline-none"
      }
    >
      {/* Основное фото */}
      <div
        className={
          full
            ? "relative min-h-0 flex-1"
            : "relative aspect-[16/9] overflow-hidden rounded-3xl border border-line"
        }
      >
        <div
          className="absolute inset-0 cursor-pointer touch-pan-y"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (startX.current = null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={pictures[index]}
            src={pictures[index]}
            alt={`${title} — фото ${index + 1}`}
            draggable={false}
            className={`h-full w-full select-none ${
              full ? "object-contain" : "object-cover"
            }`}
          />
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Назад"
              onClick={() => go(index - 1)}
              className={`${arrow} left-3`}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Вперёд"
              onClick={() => go(index + 1)}
              className={`${arrow} right-3`}
            >
              ›
            </button>
          </>
        ) : null}

        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white">
          {index + 1} / {count}
        </span>

        <button
          type="button"
          aria-label={full ? "Выйти из полноэкранного режима" : "На весь экран"}
          onClick={toggleFull}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/70"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {full ? (
              <path d="M9 3v4a2 2 0 0 1-2 2H3M21 9h-4a2 2 0 0 1-2-2V3M3 15h4a2 2 0 0 1 2 2v4M15 21v-4a2 2 0 0 1 2-2h4" />
            ) : (
              <path d="M3 9V5a2 2 0 0 1 2-2h4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M9 21H5a2 2 0 0 1-2-2v-4" />
            )}
          </svg>
        </button>
      </div>

      {/* Миниатюры */}
      {count > 1 ? (
        <div ref={thumbs} className="flex gap-2 overflow-x-auto pb-1">
          {pictures.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Фото ${i + 1}`}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === index
                  ? "border-gold opacity-100"
                  : "border-transparent opacity-55 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}