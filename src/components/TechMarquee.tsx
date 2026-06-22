const TECHS = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "WordPress",
  "PostgreSQL",
  "Tailwind CSS",
  "Telegram Bots",
  "amoCRM",
  "Битрикс24",
  "RetailCRM",
  "ЮKassa",
  "1С CommerceML",
  "REST · Webhooks",
  "VPS · nginx · PM2",
];

export default function TechMarquee() {
  // Бесшовная лента: список дублируется ровно вдвое, трек анимируется
  // от 0 до translateX(-50%) — на стыке копия совпадает с началом первой.
  return (
    <section
      aria-hidden="true"
      className="relative mt-14 overflow-hidden border-y border-text/5 bg-bg-card/30 py-6 md:mt-20"
    >
      <div className="marquee-mask">
        <div className="marquee-track flex w-max">
          {[...TECHS, ...TECHS].map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-10 pr-10 text-sm uppercase tracking-[0.18em] text-text-muted"
            >
              <span>{t}</span>
              <span className="h-1 w-1 rounded-full bg-accent/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
