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
    <section id="about" className="py-10 md:py-14">
      <div className="container-site">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            {image ? (
              <div className="hero-photo-frame relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-full bg-bg-card md:max-w-[320px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={title}
                  className="absolute inset-0 h-full w-full scale-110 object-cover grayscale"
                />
                {/* Стеклянный оверлей - top-left highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 18%, transparent 38%, transparent 62%, rgba(0,0,0,0.18) 88%, rgba(0,0,0,0.30) 100%)",
                  }}
                />
                {/* Диагональный блик */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(118deg, transparent 38%, rgba(255,255,255,0.10) 46%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.10) 54%, transparent 62%)",
                    mixBlendMode: "screen",
                  }}
                />
              </div>
            ) : (
              <div className="mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center rounded-full border border-text/5 bg-bg-card text-text-dim md:max-w-[320px]">
                Фото
              </div>
            )}
          </div>
          <div className="md:col-span-8">
            <div className="eyebrow mb-6">{eyebrow}</div>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              <span className="text-accent">{title}</span>
            </h2>
            <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-relaxed text-text-muted">
              {text}
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted transition hover:text-accent"
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
