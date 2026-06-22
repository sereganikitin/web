import Link from "next/link";

export default function About({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
}) {
  return (
    <section id="about" className="py-14 md:py-20">
      <div className="container-site">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-text/5 bg-bg-card">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-dim">
                  Фото
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="eyebrow mb-6">{eyebrow}</div>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              <span className="text-accent">{title}</span>
            </h2>
            <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-relaxed text-text-muted">
              {text}
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted transition hover:text-accent"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-text/10 transition group-hover:border-accent">
                →
              </span>
              Подробнее обо мне
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
