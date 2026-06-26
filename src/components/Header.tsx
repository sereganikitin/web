"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links = [
  { id: "services", label: "Услуги" },
  { id: "work", label: "Работы" },
  { id: "about", label: "Обо мне" },
  { id: "contacts", label: "Контакты" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function go(id: string) {
    return (e: React.MouseEvent) => {
      setOpen(false);
      if (onHome) {
        // На главной - плавный скролл к якорю без перезагрузки/смены URL.
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.location.hash = id;
        }
      }
      // На подстранице - стандартный переход браузера по href="/#id",
      // он сам перейдёт на главную и доскроллит к нужной секции.
    };
  }

  function goTop(e: React.MouseEvent) {
    if (onHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // На подстранице - стандартный переход по href="/"
  }

  return (
    <header className="fixed left-0 right-0 top-4 z-40">
      <div className="container-site">
        <nav
          className={`mx-auto flex w-full items-center gap-1 rounded-full border border-text/10 px-2 py-2 backdrop-blur-md transition md:w-auto ${
            scrolled ? "bg-bg/80 shadow-lg shadow-black/40" : "bg-bg-card/60"
          }`}
        >
          <a href="/" onClick={goTop} className="px-4" aria-label="На главную">
            <Logo size="text-lg" />
          </a>
          <a
            href="/"
            onClick={goTop}
            className="font-serif text-sm uppercase tracking-wider text-text-muted transition hover:text-text md:hidden"
          >
            Сергей Никитин
          </a>
          <ul className="hidden items-center gap-1 md:ml-auto md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`/#${l.id}`}
                  onClick={go(l.id)}
                  className="rounded-full px-4 py-2 text-sm text-text-muted transition hover:bg-text/5 hover:text-text"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/#contacts"
            onClick={go("contacts")}
            className="ml-1 hidden md:inline-flex btn-accent text-xs px-4 py-2"
          >
            Связаться
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden ml-auto rounded-full px-3 py-2 text-text-muted hover:text-text"
            aria-label="Меню"
          >
            {open ? "✕" : "☰"}
          </button>
        </nav>
      </div>
      {open && (
        <div className="container-site mt-3 md:hidden">
          <div className="rounded-2xl border border-text/10 bg-bg-card p-4">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={`/#${l.id}`}
                    onClick={go(l.id)}
                    className="block rounded-lg px-4 py-3 text-text-muted hover:bg-text/5 hover:text-text"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/#contacts"
                  onClick={go("contacts")}
                  className="mt-2 block rounded-full bg-accent px-4 py-3 text-center text-sm font-medium text-bg"
                >
                  Связаться
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
