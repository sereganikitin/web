"use client";

import { useEffect, useRef } from "react";
import HeroGlow from "./HeroGlow";

type Props = {
  eyebrow: string;
  line1: string;
  line2: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image?: string;
};

export default function Hero({
  eyebrow,
  line1,
  line2,
  subtitle,
  ctaLabel,
  ctaHref,
  image,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  // Мягкий parallax фото за курсором — сдвиг до ±10px,
  // отключается в prefers-reduced-motion.
  useEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    if (!section || !photo || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    function tick() {
      // exponential damping для плавности
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (photo) {
        photo.style.setProperty("--tx", `${cx.toFixed(2)}px`);
        photo.style.setProperty("--ty", `${cy.toFixed(2)}px`);
      }
      raf = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      if (!section) return;
      const r = section.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tx = nx * 18;
      ty = ny * 14;
    }

    function onLeave() {
      tx = 0;
      ty = 0;
    }

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[88vh] items-center overflow-hidden pt-28 md:pt-32"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg-card/40 via-bg to-bg" />
      <HeroGlow />

      <div className="container-site relative flex flex-col items-center text-center">
        {eyebrow && (
          <div className="eyebrow mb-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-text/10 bg-bg-card/60 px-4 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(206,179,137,0.6)]" />
              {eyebrow}
            </span>
          </div>
        )}

        {image && (
          <div
            ref={photoRef}
            className="hero-photo mb-12 h-56 w-56 md:h-72 md:w-72"
          >
            <div className="hero-photo-glow" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Сергей Никитин"
              className="hero-photo-img h-full w-full object-cover grayscale"
            />
          </div>
        )}

        <h1 className="font-serif text-6xl leading-[1.02] tracking-tight md:text-8xl">
          <span className="block">{line1}</span>
          <span className="block italic text-accent">{line2}</span>
        </h1>

        <p className="mt-8 max-w-2xl text-base text-text-muted md:text-lg">
          {subtitle}
        </p>

        <a
          href={ctaHref}
          className="group mt-12 inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-sm font-medium text-bg shadow-[0_20px_60px_-15px_rgba(206,179,137,0.5)] transition hover:bg-accent/90 hover:shadow-[0_24px_70px_-15px_rgba(206,179,137,0.7)]"
        >
          {ctaLabel}
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bg/15 text-bg transition group-hover:translate-x-0.5">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}
