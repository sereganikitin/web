import Link from "next/link";
import type { PortfolioItem } from "@/lib/db";

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
    <section id="work" className="py-20 md:py-28">
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
              <article
                key={p.id}
                className="group relative aspect-video overflow-hidden rounded-2xl border border-text/5 bg-bg-card"
              >
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-elevated to-bg text-text-dim">
                    {p.title}
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg from-25% via-bg/90 via-60% to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                  <div>
                    <div className="font-serif text-2xl">{p.title}</div>
                    {p.description && (
                      <div className="mt-1 max-w-md text-sm text-text-muted line-clamp-2">
                        {p.description}
                      </div>
                    )}
                  </div>
                  <div className="rounded-full border border-text/10 bg-bg/60 px-3 py-1 text-[10px] uppercase tracking-wider text-text-muted">
                    {p.category}
                  </div>
                </div>
                <Link
                  href={`/portfolio/${p.slug}`}
                  className="absolute inset-0"
                  aria-label={`Открыть ${p.title}`}
                />
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-text/10 bg-bg/60 text-text-muted backdrop-blur transition hover:border-accent hover:text-accent"
                    title="Открыть сайт проекта"
                  >
                    ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
