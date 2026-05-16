"use client";

import { useEffect, useRef } from "react";

export default function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      el.style.setProperty("--scroll", String(window.scrollY));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="hero-glow-wrap hero-glow-pos-1">
        <div className="hero-glow hero-glow-drift-1" />
      </div>
      <div className="hero-glow-wrap hero-glow-pos-2">
        <div className="hero-glow hero-glow-drift-2" />
      </div>
      <div className="hero-glow-wrap hero-glow-pos-3">
        <div className="hero-glow hero-glow-drift-3" />
      </div>
    </div>
  );
}
