import Link from "next/link";
import type { PortfolioItem } from "@/lib/db";
import WorkCard from "./WorkCard";

export default function SelectedWork({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: PortfolioItem[];
}) {
  return (
    <section id="work" className="py-14 md:py-20">
      <div className="container-site">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-serif text-4xl md:text-5xl">
            <span className="text-text">{eyebrow} </span>
            <span className="italic text-accent">{title}</span>
          </h2>
          <Link
            href="/portfolio"
            className="hidden items-center gap-2 text-xs uppercase tracking-wider text-text-muted transition hover:text-accent md:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-text/10 transition group-hover:border-accent">
              →
            </span>
            Все работы
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="text-text-muted">Скоро здесь появятся проекты.</p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((p) => (
                <WorkCard key={p.id} p={p} />
              ))}
            </div>
            <div className="mt-8 flex justify-center md:hidden">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-text/15 px-5 py-3 text-sm text-text transition hover:border-accent hover:text-accent"
              >
                Все работы →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
