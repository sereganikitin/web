import Link from "next/link";

type Service = { num: string; title: string; text: string; href?: string };

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
          {items.map((s, i) => {
            const inner = (
              <>
                <div className="text-xs text-text-dim">{s.num}</div>
                <h3 className="mt-6 text-lg font-medium uppercase tracking-wide">
                  {s.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-text-muted">
                  {s.text}
                </p>
                <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-text/10 transition group-hover:border-accent group-hover:text-accent">
                    →
                  </span>
                  Подробнее
                </div>
              </>
            );
            const className =
              "group block rounded-2xl border border-text/10 bg-bg-card p-7 shadow-2xl shadow-black/40 transition hover:bg-bg-elevated hover:shadow-black/60";
            return s.href ? (
              <Link key={i} href={s.href} className={className}>
                {inner}
              </Link>
            ) : (
              <article key={i} className={className}>
                {inner}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
