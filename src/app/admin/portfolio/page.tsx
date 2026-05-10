import Link from "next/link";
import { listPortfolio } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function PortfolioListPage() {
  const items = listPortfolio();
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">
            <span className="italic text-accent">Портфолио</span>
          </h1>
          <p className="mt-2 text-text-muted">Кейсы в разделе Selected Work.</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg hover:bg-accent/90"
        >
          + Добавить
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-text/5 bg-bg-card">
        {items.length === 0 ? (
          <div className="p-8 text-center text-text-muted">Пока нет кейсов</div>
        ) : (
          <ul className="divide-y divide-text/5">
            {items.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/portfolio/${p.id}`}
                  className="flex items-center gap-4 p-4 transition hover:bg-bg-elevated"
                >
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-text/10 bg-bg">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium text-text">{p.title}</span>
                      {!p.is_published && (
                        <span className="rounded-full bg-text/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-dim">
                          скрыт
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted">
                      {p.category || "—"} · позиция {p.position}
                    </div>
                  </div>
                  <span className="text-text-dim">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
