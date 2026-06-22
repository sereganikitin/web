"use client";

import { useEffect, useRef } from "react";

export default function HeroPhoto({ src }: { src: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Эффекты:
  // 1) Mouse tilt — wrapper наклоняется за курсором (perspective + rotate3d).
  // 2) Mouse parallax — картинка внутри сдвигается на ±10px.
  // 3) Scroll parallax — на скролле картинка ползёт чуть медленнее (-20%).
  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Targets (куда стремимся) и current (актуальные значения с lerp-damping)
    const t = { rotX: 0, rotY: 0, parX: 0, parY: 0, scroll: 0 };
    const c = { rotX: 0, rotY: 0, parX: 0, parY: 0, scroll: 0 };
    let raf = 0;

    function tick() {
      const k = 0.08;
      c.rotX += (t.rotX - c.rotX) * k;
      c.rotY += (t.rotY - c.rotY) * k;
      c.parX += (t.parX - c.parX) * k;
      c.parY += (t.parY - c.parY) * k;
      c.scroll += (t.scroll - c.scroll) * 0.15;

      if (wrap) {
        wrap.style.transform = `perspective(1100px) rotateX(${c.rotX.toFixed(2)}deg) rotateY(${c.rotY.toFixed(2)}deg)`;
      }
      if (img) {
        const totalY = c.parY - c.scroll * 0.18;
        img.style.transform = `translate3d(${c.parX.toFixed(2)}px, ${totalY.toFixed(2)}px, 0) scale(1.12)`;
      }
      raf = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      t.rotX = -ny * 5; // наклон вверх/вниз
      t.rotY = nx * 5; // влево/вправо
      t.parX = nx * 12; // картинка плывёт в ту же сторону
      t.parY = ny * 10;
    }

    function onLeave() {
      t.rotX = 0;
      t.rotY = 0;
      t.parX = 0;
      t.parY = 0;
    }

    function onScroll() {
      t.scroll = window.scrollY;
    }

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    raf = requestAnimationFrame(tick);

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hero-photo-wrap relative" ref={wrapRef}>
      {/* Champagne glow подложка */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_center,_rgba(206,179,137,0.35)_0%,_rgba(206,179,137,0)_60%)] blur-2xl"
      />

      <div
        ref={innerRef}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-bg-card shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt="Сергей Никитин"
          className="absolute inset-0 h-full w-full object-cover grayscale"
          style={{ willChange: "transform" }}
        />

        {/* Угловые маркеры — рамка-видоискатель */}
        <div className="pointer-events-none absolute inset-3">
          <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-accent/60" />
          <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-accent/60" />
          <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-accent/60" />
          <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-accent/60" />
        </div>

        {/* Лейбл в углу */}
        <div className="absolute right-4 top-4 rounded-full bg-bg/80 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-accent backdrop-blur">
          Anno 2026
        </div>

        {/* Тонкий nоиз/grain через repeating-linear-gradient — субтильно */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      {/* Подпись под фото */}
      <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-text-dim">
        <span>Сергей Никитин</span>
        <span className="text-accent">Web · Code · Bots</span>
      </div>
    </div>
  );
}
