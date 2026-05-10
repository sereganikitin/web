import type { ClientLogo } from "@/lib/db";

export default function ClientLogos({ logos }: { logos: ClientLogo[] }) {
  if (!logos.length) return null;
  return (
    <section className="border-y border-text/5 bg-bg-card/30 py-10">
      <div className="container-site">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70">
          {logos.map((l) => {
            const inner = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={l.image}
                alt={l.name}
                className="h-7 w-auto object-contain transition hover:opacity-100"
              />
            );
            return l.link ? (
              <a key={l.id} href={l.link} target="_blank" rel="noreferrer noopener">
                {inner}
              </a>
            ) : (
              <div key={l.id}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
