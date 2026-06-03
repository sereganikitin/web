"use client";

import Link from "next/link";
import { useRef } from "react";
import type { PortfolioItem } from "@/lib/db";

const MAX_TILT_DEG = 4;

export default function WorkCard({ p }: { p: PortfolioItem }) {
  const ref = useRef<HTMLElement>(null);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--ry", `${px * MAX_TILT_DEG}`);
    el.style.setProperty("--rx", `${-py * MAX_TILT_DEG}`);
  }

  function onEnter() {
    ref.current?.setAttribute("data-hovering", "true");
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.removeAttribute("data-hovering");
    el.style.setProperty("--rx", "0");
    el.style.setProperty("--ry", "0");
  }

  return (
    <article
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="work-card group relative aspect-video overflow-hidden rounded-2xl bg-bg-card"
    >
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
        <div className="rounded-full bg-bg/80 px-3 py-1 text-[10px] uppercase tracking-wider text-accent backdrop-blur">
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
