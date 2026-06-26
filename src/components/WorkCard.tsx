import Link from "next/link";
import type { PortfolioItem } from "@/lib/db";

export default function WorkCard({ p }: { p: PortfolioItem }) {
  return (
    <article className="group relative">
      <Link
        href={`/portfolio/${p.slug}`}
        aria-label={`Открыть ${p.title}`}
        className="block"
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-bg">
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
          {/* Градиент-overlay + заголовок поверх фото - только на md+. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-3/5 bg-gradient-to-t from-bg via-bg/80 to-transparent md:block" />
          <div className="absolute inset-x-0 bottom-0 hidden items-end p-6 md:flex">
            <div>
              <div className="font-serif text-3xl leading-tight md:text-4xl">{p.title}</div>
              {p.description && (
                <div className="mt-1 max-w-md text-base text-text-muted line-clamp-2">
                  {p.description}
                </div>
              )}
            </div>
          </div>
          {/* Чип категории - в правом нижнем углу фото, виден всегда. */}
          <div className="absolute bottom-4 right-4 z-10 rounded-full bg-bg px-3 py-1.5 text-[10px] uppercase tracking-wider text-accent shadow-lg shadow-black/40">
            {p.category}
          </div>
        </div>
        {/* Мобайл: заголовок под фото, мельче; описание скрыто. */}
        <div className="mt-3 px-1 md:hidden">
          <div className="font-serif text-lg leading-snug">{p.title}</div>
        </div>
      </Link>
      {p.link && (
        <a
          href={p.link}
          target="_blank"
          rel="noreferrer noopener"
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-text/10 bg-bg/60 text-text-muted backdrop-blur transition hover:border-accent hover:text-accent"
          title="Открыть сайт проекта"
        >
          ↗
        </a>
      )}
    </article>
  );
}
