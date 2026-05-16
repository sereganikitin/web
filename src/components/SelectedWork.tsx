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
          <div className="hidden items-center gap-2 text-xs uppercase tracking-wider text-text-muted md:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-text/10">
              →
            </span>
            Все работы
          </div>
        </div>

        {items.length === 0 ? (
          <p className="text-text-muted">Скоро здесь появятся проекты.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((p) => (
              <WorkCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
