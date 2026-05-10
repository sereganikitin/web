type Props = {
  eyebrow: string;
  line1: string;
  line2: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image?: string;
};

export default function Hero({ eyebrow, line1, line2, subtitle, ctaLabel, ctaHref, image }: Props) {
  return (
    <section id="top" className="relative pt-36 pb-20 md:pt-48 md:pb-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg-card/40 via-bg to-bg" />
      <div className="container-site flex flex-col items-center text-center">
        {eyebrow && <div className="eyebrow mb-8">{eyebrow}</div>}

        {image && (
          <div className="mb-10 h-44 w-44 overflow-hidden rounded-full border border-text/10 bg-bg-card shadow-2xl shadow-black/40 animate-float-slow md:h-56 md:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Сергей Никитин" className="h-full w-full object-cover grayscale" />
          </div>
        )}

        <h1 className="font-serif text-5xl leading-[1.05] md:text-7xl">
          <span className="block">{line1}</span>
          <span className="block italic text-accent">{line2}</span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-text-muted md:text-lg">{subtitle}</p>

        <a href={ctaHref} className="mt-10 btn-outline group">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent transition group-hover:bg-accent group-hover:text-bg">
            ↓
          </span>
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
