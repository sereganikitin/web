"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "#services", label: "Услуги" },
  { href: "#work", label: "Работы" },
  { href: "#about", label: "Обо мне" },
  { href: "#contacts", label: "Контакты" },
];

export default function Header() {
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
          scrolled ? "bg-bg/80 shadow-2xl shadow-black/40" : "bg-bg-card/60"
        }`}
      >
        <a href="#top" className="px-4" aria-label="На главную">
          <Logo size="text-lg" />
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-text-muted transition hover:bg-text/5 hover:text-text"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contacts" className="ml-1 hidden md:inline-flex btn-accent text-xs px-4 py-2">
          Связаться
        </a>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-full px-3 py-2 text-text-muted hover:text-text"
          aria-label="Меню"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>
      {open && (
        <div className="absolute top-full mt-3 w-[calc(100%-2rem)] rounded-2xl border border-text/10 bg-bg-card p-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-text-muted hover:bg-text/5 hover:text-text"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contacts"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-full bg-accent px-4 py-3 text-center text-sm font-medium text-bg"
              >
                Связаться
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
