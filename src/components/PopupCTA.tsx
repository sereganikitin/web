"use client";

import { useEffect, useState } from "react";
import LeadForm from "./LeadForm";

const STORAGE_KEY = "popup_cta_dismissed";
const DELAY_MS = 30_000;

export default function PopupCTA() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    const t = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm md:items-center"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-text/10 bg-bg-card p-6 shadow-2xl shadow-black/60 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Закрыть"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-text/10 text-text-muted transition hover:border-accent hover:text-accent"
        >
          ×
        </button>

        <div className="eyebrow mb-2">Свяжитесь со мной</div>
        <h3 className="font-serif text-2xl md:text-3xl">
          Обсудим <span className="italic text-accent">проект?</span>
        </h3>
        <p className="mt-3 text-base text-text-muted">
          Оставьте контакт — отвечу в течение дня.
        </p>

        <div className="mt-6">
          <LeadForm source="popup" variant="popup" />
        </div>
      </div>
    </div>
  );
}
