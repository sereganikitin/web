import HeroGlow from "./HeroGlow";
import HeroPhoto from "./HeroPhoto";

type Props = {
  eyebrow: string;
  line1: string;
  line2: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image?: string;
};

const KPI = [
  { label: "Опыт", value: "10+ лет" },
  { label: "Проектов", value: "30+" },
  { label: "Локация", value: "Москва" },
  { label: "Отвечу", value: "за день" },
];

export default function Hero({
  eyebrow,
  line1,
  line2,
  subtitle,
  ctaLabel,
  ctaHref,
  image,
}: Props) {
  const title1 = line1?.trim();
  const title2 = line2?.trim();

  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] items-center overflow-hidden pt-28 md:pt-32"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg-card/40 via-bg to-bg" />
      <HeroGlow />

      <div className="container-site relative w-full">
        <div className="grid items-center gap-12 md:grid-cols-12 lg:gap-16">
          {/* Левая колонка: заголовок и CTA */}
          <div className="md:col-span-7">
            {eyebrow && (
              <div className="mb-10 animate-fade-in-up">
                <span className="inline-flex items-center gap-2 rounded-full border border-text/10 bg-bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-text-muted backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(206,179,137,0.6)]" />
                  {eyebrow}
                </span>
              </div>
            )}

            <h1 className="font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-6xl lg:text-8xl">
              {title1}
              {title1 && title2 ? " " : ""}
              {title2 && <span className="text-accent">{title2}</span>}
            </h1>

            <p className="mt-8 max-w-xl text-base text-text-muted md:text-lg">
              {subtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={ctaHref}
                className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-sm font-medium uppercase tracking-wider text-bg shadow-lg shadow-black/40 transition hover:bg-accent/90 hover:shadow-black/60"
              >
                {ctaLabel}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bg/15 text-bg transition group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="/uslugi"
                className="text-sm uppercase tracking-wider text-text-muted underline-offset-8 transition hover:text-accent hover:underline"
              >
                Все услуги
              </a>
            </div>
          </div>

          {/* Правая колонка: фото с эффектами */}
          {image && (
            <div className="md:col-span-5">
              <HeroPhoto src={image} />
            </div>
          )}
        </div>

        {/* KPI на всю ширину */}
        <div className="mt-16 grid grid-cols-2 gap-y-6 border-t border-text/5 pt-8 md:mt-20 md:grid-cols-4">
          {KPI.map((k) => (
            <div key={k.label}>
              <div className="text-[10px] uppercase tracking-[0.22em] text-text-dim">
                {k.label}
              </div>
              <div className="mt-2 font-serif text-2xl text-text md:text-3xl">
                {k.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
