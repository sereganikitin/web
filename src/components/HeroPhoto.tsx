"use client";

import { useEffect, useRef } from "react";

export default function HeroPhoto({ src }: { src: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Эффекты:
  // 1) Mouse tilt - wrapper наклоняется за курсором (perspective + rotate3d).
  // 2) Mouse parallax - картинка внутри сдвигается на ±10px.
  // 3) Scroll parallax - на скролле картинка ползёт чуть медленнее (-20%).
  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Mouse-only parallax: tilt рамки + сдвиг картинки внутри.
    // Scroll parallax намеренно убран - он создавал зазор внизу
    // при возврате прокрутки, так как накапливался без сброса.
    const t = { rotX: 0, rotY: 0, parX: 0, parY: 0 };
    const c = { rotX: 0, rotY: 0, parX: 0, parY: 0 };
    let raf = 0;

    function tick() {
      const k = 0.08;
      c.rotX += (t.rotX - c.rotX) * k;
      c.rotY += (t.rotY - c.rotY) * k;
      c.parX += (t.parX - c.parX) * k;
      c.parY += (t.parY - c.parY) * k;

      if (wrap) {
        wrap.style.transform = `perspective(1100px) rotateX(${c.rotX.toFixed(2)}deg) rotateY(${c.rotY.toFixed(2)}deg)`;
      }
      if (img) {
        img.style.transform = `translate3d(${c.parX.toFixed(2)}px, ${c.parY.toFixed(2)}px, 0) scale(1.12)`;
      }
      raf = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      t.rotX = -ny * 5;
      t.rotY = nx * 5;
      t.parX = nx * 12;
      t.parY = ny * 10;
    }

    function onLeave() {
      t.rotX = 0;
      t.rotY = 0;
      t.parX = 0;
      t.parY = 0;
    }

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hero-photo-wrap relative" ref={wrapRef}>
      <div
        ref={innerRef}
        className="hero-photo-frame relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[28px] bg-bg-card md:ml-auto md:mr-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt="Сергей Никитин"
          className="absolute inset-0 h-full w-full object-cover grayscale"
          style={{ willChange: "transform" }}
        />

        {/* Стеклянный оверлей - top-left highlight + bottom-right tint */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 18%, transparent 38%, transparent 62%, rgba(0,0,0,0.18) 88%, rgba(0,0,0,0.30) 100%)",
          }}
        />

        {/* Диагональная блик-полоса - как отражение на закалённом стекле */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(118deg, transparent 38%, rgba(255,255,255,0.10) 46%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.10) 54%, transparent 62%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Тонкий шум/grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-15"
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
