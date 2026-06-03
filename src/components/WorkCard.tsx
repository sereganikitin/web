import Link from "next/link";
import type { PortfolioItem } from "@/lib/db";

export default function WorkCard({ p }: { p: PortfolioItem }) {
  return (
    <article className="group relative aspect-video overflow-hidden rounded-2xl bg-bg">
      {p.image ? (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={p.title}
            className="relative h-full w-full object-contain transition duration-700 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-elevated to-bg text-text-dim">
          {p.title}
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg from-10% via-bg/85 via-55% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
        <div>
          <div className="font-serif text-2xl">{p.title}</div>
          {p.description && (
            <div className="mt-1 max-w-md text-base text-text-muted line-clamp-2">
              {p.description}
            </div>
          )}
        </div>
        <div className="rounded-full bg-bg px-3 py-1.5 text-[10px] uppercase tracking-wider text-accent shadow-lg shadow-black/40">
          {p.category}
        </div>
      </div>
      <Link
        href={`/portfolio/${p.slug}`}
        className="absolute inset-0"
        aria-label={`Открыть ${p.title}`}
      />
      {p.link && (
        <a
          href={p.link}
          target="_blank"
          rel="noreferrer noopener"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-text/10 bg-bg/60 text-text-muted backdrop-blur transition hover:border-accent hover:text-accent"
          title="Открыть сайт проекта"
        >
          ↗
        </a>
      )}
    </article>
  );
}
