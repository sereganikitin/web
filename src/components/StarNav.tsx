"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

type StarLink = { slug: string; name: string };

export default function StarNav({
  stars,
  currentSlug,
}: {
  stars: StarLink[];
  currentSlug: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-4 z-40 flex justify-center px-4">
      <nav
        className={`flex items-center gap-1 rounded-full border border-text/10 px-2 py-2 backdrop-blur-md transition ${
          scrolled ? "bg-bg/80 shadow-lg shadow-black/40" : "bg-bg-card/60"
        }`}
      >
        <Link href="/" className="px-4" aria-label="На главную">
          <Logo size="text-lg" />
        </Link>
        <Link
          href="/stars"
          className="rounded-full px-4 py-2 text-sm text-text-muted transition hover:bg-text/5 hover:text-text"
        >
          Все звёзды
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full px-3 py-2 text-text-muted hover:text-text"
          aria-label="Переключить звезду"
          aria-expanded={open}
        >
          {open ? "✕" : "★"}
        </button>
      </nav>

      {open && (
        <div className="absolute top-full mt-3 max-h-[70vh] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl border border-text/10 bg-bg-card p-3 glass-card">
          <div className="px-2 pb-2 pt-1 text-xs uppercase tracking-[0.18em] text-text-muted">
            Звёздная парковка
          </div>
          <ul className="flex flex-col gap-1">
            {stars.map((s) => {
              const active = s.slug === currentSlug;
              return (
                <li key={s.slug}>
                  <Link
                    href={`/stars/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm transition ${
                      active
                        ? "bg-accent/15 text-accent"
                        : "text-text-muted hover:bg-text/5 hover:text-text"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className={active ? "text-accent" : "text-text-dim"}>★</span>
                    {s.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
