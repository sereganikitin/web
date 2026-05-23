import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Theme preview",
  robots: { index: false, follow: false },
};

const VARIANTS = [
  {
    name: "Mint / Emerald",
    accent: "#34d399",
    desc: "Свежий зелёный. Терминал, success в IDE, git diff +.",
  },
  {
    name: "Indigo / Violet",
    accent: "#818cf8",
    desc: "Премиум-фиолетовый. Vercel, Linear, Discord, AI/SaaS.",
  },
  {
    name: "Sky Blue",
    accent: "#38bdf8",
    desc: "Голубой. VS Code keywords, Tailwind, technical docs.",
  },
  {
    name: "Coral / Rust",
    accent: "#fb923c",
    desc: "Тёплый оранжевый. Rust, Stripe, HackerRank, dev-meetups.",
  },
  {
    name: "Electric Cyan",
    accent: "#06b6d4",
    desc: "Неоновый бирюзовый. Cyberpunk, чисто-tech, неожиданно.",
  },
  {
    name: "Lime / Acid",
    accent: "#a3e635",
    desc: "Ядовито-салатовый. Энергия, кнопки CTA выделяются издалека.",
  },
  {
    name: "Magenta / Pink",
    accent: "#ec4899",
    desc: "Smart-пинк. JetBrains, Figma. Креативный dev, не банально.",
  },
  {
    name: "Teal",
    accent: "#14b8a6",
    desc: "Бирюзово-зелёный. Спокойный SaaS, что-то между mint и sky.",
  },
  {
    name: "Slate / Steel",
    accent: "#94a3b8",
    desc: "Стальной серый. Monochrome без цвета — Apple-стиль, премиум-минимализм.",
  },
  {
    name: "Lavender",
    accent: "#c4b5fd",
    desc: "Мягкая лаванда. Нежно, спокойно, нестандартно для tech-сайта.",
  },
  {
    name: "Salmon",
    accent: "#fb7185",
    desc: "Тёплый розово-красный. Дружелюбный, заметный, не агрессивный.",
  },
  {
    name: "Periwinkle",
    accent: "#a5b4fc",
    desc: "Голубо-фиолетовый. Между Indigo и Lavender — модный 2025-2026.",
  },
];

export default function ThemePreview() {
  return (
    <main style={{ background: "#17171a", minHeight: "100vh", padding: "60px 24px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            color: "#9ca3af",
            textDecoration: "none",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          ← Вернуться на сайт
        </Link>

        <h1
          style={{
            fontFamily: '"IBM Plex Serif", Georgia, serif',
            color: "#ffffff",
            fontSize: 48,
            margin: "24px 0 8px",
            lineHeight: 1.1,
          }}
        >
          Выберите акцентный цвет
        </h1>
        <p style={{ color: "#e5e7eb", fontSize: 16, margin: "0 0 48px", maxWidth: 700 }}>
          Каждый блок — мини-Hero с одним и тем же текстом, но разным акцентом.
          Графит-фон и белый текст одинаковые. Покажет, как акцент работает на курсиве,
          плашке категории, кнопках и стрелках.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {VARIANTS.map((v) => (
            <Card key={v.accent} {...v} />
          ))}
        </div>

        <div style={{ marginTop: 60, color: "#9ca3af", fontSize: 14 }}>
          Напиши в чат название варианта (Mint, Indigo, Sky, Coral, Cyan, Lime,
          Magenta, Teal, Slate, Lavender, Salmon, Periwinkle) — применю на весь сайт
          и уберу превью-страницу.
        </div>
      </div>
    </main>
  );
}

function Card({ name, accent, desc }: { name: string; accent: string; desc: string }) {
  const bg = "#17171a";
  const card = "#1f1f23";
  const text = "#ffffff";
  const muted = "#e5e7eb";
  const dim = "#9ca3af";

  return (
    <div
      style={{
        background: card,
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: 16,
        padding: 32,
        position: "relative",
      }}
    >
      {/* Hero мокап */}
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: muted,
        }}
      >
        Веб-разработчик в Москве
      </div>

      <h2
        style={{
          fontFamily: '"IBM Plex Serif", Georgia, serif',
          fontSize: 36,
          lineHeight: 1.05,
          margin: "16px 0 0",
          color: text,
        }}
      >
        Сайты любой
      </h2>
      <h2
        style={{
          fontFamily: '"IBM Plex Serif", Georgia, serif',
          fontStyle: "italic",
          fontSize: 36,
          lineHeight: 1.05,
          margin: 0,
          color: accent,
        }}
      >
        сложности
      </h2>

      <p style={{ color: muted, fontSize: 14, lineHeight: 1.6, marginTop: 16 }}>
        Лендинги, корпоративные сайты, интернет-магазины и Telegram-боты.
      </p>

      {/* Кнопки */}
      <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
        <button
          style={{
            background: accent,
            color: bg,
            border: "none",
            padding: "10px 20px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Обсудить проект
        </button>
        <button
          style={{
            background: "transparent",
            color: text,
            border: `1px solid ${accent}`,
            padding: "10px 20px",
            borderRadius: 999,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          → Мои услуги
        </button>
      </div>

      {/* Карточка кейса (миниатюра) */}
      <div
        style={{
          marginTop: 24,
          background: bg,
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div
              style={{
                fontFamily: '"IBM Plex Serif", Georgia, serif',
                fontSize: 18,
                color: text,
              }}
            >
              Пример кейса
            </div>
            <div style={{ color: muted, fontSize: 13, marginTop: 4 }}>
              Описание проекта в две строки.
            </div>
          </div>
          <div
            style={{
              border: `1px solid ${accent}99`,
              color: accent,
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              marginLeft: 12,
            }}
          >
            Веб-дизайн
          </div>
        </div>
      </div>

      {/* Имя варианта */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: accent,
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ color: text, fontSize: 15, fontWeight: 600 }}>{name}</div>
          <div style={{ color: dim, fontSize: 12, marginTop: 2 }}>
            {accent} · {desc}
          </div>
        </div>
      </div>
    </div>
  );
}
