type Service = { num: string; title: string; text: string };

export default function Services({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: Service[];
}) {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="container-site">
        <div className="eyebrow mb-10">{eyebrow}</div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((s, i) => (
            <article
              key={i}
              className="group rounded-2xl border border-text/5 bg-bg-card p-7 transition hover:border-accent/30 hover:bg-bg-elevated"
            >
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
