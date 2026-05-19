"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_notice_accepted";

export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "1") return;
    // небольшая задержка, чтобы не моргать сразу при загрузке
    const t = window.setTimeout(() => setShow(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Уведомление о cookies"
      className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md md:left-6 md:right-auto md:mx-0"
    >
      <div className="rounded-2xl border border-text/10 bg-bg-card p-5 shadow-2xl shadow-black/60">
        <p className="text-sm text-text-muted">
          Сайт использует cookies и сервис Яндекс.Метрика для аналитики и улучшения работы.
          Продолжая использование сайта, вы соглашаетесь с обработкой данных в соответствии с{" "}
          <a
            href="/privacy"
            className="text-accent hover:underline"
          >
            Политикой конфиденциальности
          </a>
          .
        </p>
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-bg transition hover:bg-accent/90"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
