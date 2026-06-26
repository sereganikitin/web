import Link from "next/link";
import { listStars } from "@/lib/stars";

export const dynamic = "force-dynamic";

export default function StarsListPage() {
  const stars = listStars();
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">
            <span className="text-accent">Звёзды</span>
          </h1>
          <p className="mt-2 text-text-muted">Звёздная парковка — резиденты ЖК.</p>
        </div>
        <Link
          href="/admin/stars/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg hover:bg-accent/90"
        >
          + Добавить
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-text/5 bg-bg-card">
        {stars.length === 0 ? (
          <div className="p-8 text-center text-text-muted">Пока нет звёзд</div>
        ) : (
          <ul className="divide-y divide-text/5">
            {stars.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/admin/stars/${s.id}`}
                  className="flex items-center gap-4 p-4 transition hover:bg-bg-elevated"
                >
                  <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-text/10 bg-bg text-text-dim">
                    {s.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.photo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      "★"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium text-text">{s.name}</span>
                      {(s.video || s.video_embed) && (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
                          видео
                        </span>
                      )}
                      {!s.is_published && (
                        <span className="rounded-full bg-text/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-dim">
                          скрыт
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted">
                      {s.role || "—"} · позиция {s.position}
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
