import Link from "next/link";

type Service = {
  num: string;
  title: string;
  text: string;
  href?: string;
  /** Метки технологий для оборота карточки. */
  tags?: string[];
  /** «от 30 000 ₽», «от 2 недель» и т.п. */
  price?: string;
  deadline?: string;
};

export default function Services({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: Service[];
}) {
  return (
    <section id="services" className="py-14 md:py-20">
      <div className="container-site">
        <div className="mb-10 flex items-end justify-between">
          <div className="eyebrow">{eyebrow}</div>
          <Link
            href="/uslugi"
            className="hidden items-center gap-2 text-xs uppercase tracking-wider text-text-muted transition hover:text-accent md:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-text/10">
              →
            </span>
            Все услуги
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((s, i) => (
            <ServiceCard key={i} s={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ s }: { s: Service }) {
  const hasFlip = (s.tags?.length ?? 0) > 0 || s.price || s.deadline;

  const cardCls =
    "group block h-full rounded-2xl border border-text/10 bg-bg-card p-7 shadow-lg shadow-black/40 transition hover:bg-bg-elevated hover:shadow-black/60";

  const front = (
    <>
      <div className="text-xs text-text-dim">{s.num}</div>
      <h3 className="mt-6 text-lg font-medium uppercase tracking-wide">
        {s.title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-text-muted">{s.text}</p>
      <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-text/10 transition group-hover:border-accent group-hover:text-accent">
          →
        </span>
        Подробнее
      </div>
    </>
  );

  // Если backside-данных нет — обычная карточка-ссылка без flip.
  if (!hasFlip) {
    return s.href ? (
      <Link href={s.href} className={cardCls}>
        {front}
      </Link>
    ) : (
      <article className={cardCls}>{front}</article>
    );
  }

  // Flip-card: лицевая и обратная стороны.
  const back = (
    <>
      <div className="text-xs uppercase tracking-wider text-text-dim">
        {s.title}
      </div>

      {s.tags && s.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-accent/40 px-3 py-1 text-[10px] uppercase tracking-wider text-accent"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-3 text-sm text-text-muted">
        {s.price && (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-text-dim">
              Цена
            </span>
            <span className="font-serif text-xl text-accent">{s.price}</span>
          </div>
        )}
        {s.deadline && (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-text-dim">
              Срок
            </span>
            <span className="font-serif text-xl text-text">{s.deadline}</span>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-accent">
          →
        </span>
        Открыть страницу
      </div>
    </>
  );

  return (
    <div className="flip-card group h-full">
      <div className="flip-card-inner">
        <Link href={s.href ?? "#"} className={`flip-card-face ${cardCls}`}>
          {front}
        </Link>
        <Link
          href={s.href ?? "#"}
          className={`flip-card-face flip-card-back ${cardCls}`}
        >
          {back}
        </Link>
      </div>
    </div>
  );
}
