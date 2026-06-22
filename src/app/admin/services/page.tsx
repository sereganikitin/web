import Link from "next/link";
import { listServices } from "@/lib/services";

export const dynamic = "force-dynamic";

export default function AdminServicesListPage() {
  const items = listServices();
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">
            <span className="text-accent">Услуги</span>
          </h1>
          <p className="mt-2 text-text-muted">Страницы раздела /uslugi.</p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg hover:bg-accent/90"
        >
          + Добавить
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-text/5 bg-bg-card">
        {items.length === 0 ? (
          <div className="p-8 text-center text-text-muted">Пока нет услуг</div>
        ) : (
          <ul className="divide-y divide-text/5">
            {items.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/admin/services/${s.slug}`}
                  className="flex items-center gap-4 p-4 transition hover:bg-bg-elevated"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-medium text-text">{s.cardTitle || s.slug}</div>
                    <div className="text-xs text-text-muted">
                      /{s.slug} · позиция {s.position} · {s.pricing.priceFrom || "цена не указана"}
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
