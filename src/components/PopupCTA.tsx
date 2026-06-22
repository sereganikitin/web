"use client";

import { useEffect, useState } from "react";
import LeadForm from "./LeadForm";

const STORAGE_KEY = "popup_cta_dismissed";
const DELAY_MS = 60_000;

export default function PopupCTA() {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    const t = window.setTimeout(() => setMounted(true), DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setMounted(false);
  }

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(360px,calc(100vw-2rem))] animate-fade-in-up">
      <div className="relative rounded-2xl border border-text/10 bg-bg-card p-5 shadow-lg shadow-black/60">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Закрыть"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-text-muted transition hover:text-accent"
        >
          ×
        </button>

        {!expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="block w-full pr-6 text-left"
          >
            <h3 className="text-lg font-medium">
              Обсудим <span className="text-accent">проект?</span>
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Оставьте контакт — отвечу в течение дня.
            </p>
            <span className="mt-3 inline-block text-xs uppercase tracking-wider text-accent">
              Написать →
            </span>
          </button>
        ) : (
          <>
            <h3 className="text-lg font-medium">
              Обсудим <span className="text-accent">проект?</span>
            </h3>
            <div className="mt-4">
              <LeadForm source="popup" variant="popup" onSuccess={dismiss} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
