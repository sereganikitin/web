import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getContent } from "@/lib/content";

const SITE_URL = process.env.SITE_URL ?? "https://web.cd-agency.ru";
const YANDEX_METRIKA_ID = 109261322;
// Хардкод как fallback на случай отсутствия переменной окружения,
// можно переопределить через YANDEX_VERIFICATION в .env.
const YANDEX_VERIFICATION = process.env.YANDEX_VERIFICATION ?? "064aab0b765bcc56";

export async function generateMetadata(): Promise<Metadata> {
  const c = getContent();
  const title = c["site.title"] ?? "Сергей Никитин — веб-разработчик в Москве";
  const description =
    c["site.description"] ??
    "Разработка сайтов любой сложности в Москве: лендинги, визитки, корпоративные сайты, интернет-магазины, Telegram-боты. Сайты на Next.js, React, Node.js, Python. Интеграции с CRM. Полный спектр услуг по web.";
  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    keywords: [
      // основные направления
      "разработка сайтов",
      "веб-разработка",
      "веб-разработчик",
      "веб-разработчик в Москве",
      "создание сайтов",
      "сайты любой сложности",
      "полный спектр услуг по web",
      // ценовые запросы
      "лендинг недорого",
      "сайт дешево",
      "заказать сайт",
      // типы сайтов
      "лендинг",
      "сайт-визитка",
      "корпоративный сайт",
      "интернет-магазин",
      // технологии
      "сайты на Next.js",
      "сайты на Next js",
      "сайты на React",
      "сайты на Python",
      "сайты на Node.js",
      "TypeScript",
      // дополнительные услуги
      "телеграм-боты",
      "telegram боты",
      "разработка telegram-ботов",
      "интеграция сайта с CRM",
      "интеграция с amoCRM",
      "интеграция с Битрикс24",
      "frontend разработчик",
      "backend разработчик",
      "Сергей Никитин",
    ],
    authors: [{ name: "Сергей Никитин" }],
    creator: "Сергей Никитин",
    verification: YANDEX_VERIFICATION ? { yandex: YANDEX_VERIFICATION } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ru_RU",
      siteName: "Сергей Никитин",
      url: SITE_URL,
      images: c["hero.image"]
        ? [{ url: c["hero.image"], width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: c["hero.image"] ? [c["hero.image"]] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const c = getContent();
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Сергей Никитин",
    jobTitle: "Веб-разработчик",
    url: SITE_URL,
    description: c["site.description"] ?? undefined,
    image: c["hero.image"] ? new URL(c["hero.image"], SITE_URL).toString() : undefined,
    sameAs: [
      c["contacts.telegram"],
      c["contacts.whatsapp"],
      c["contacts.github"],
    ].filter((v): v is string => Boolean(v && /^https?:\/\//.test(v))),
    email: c["contacts.email"] ? `mailto:${c["contacts.email"]}` : undefined,
    telephone: c["contacts.phone"] || undefined,
    knowsAbout: [
      "Frontend разработка",
      "Backend разработка",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Создание сайтов",
    ],
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: c["site.title"] ?? "Сергей Никитин — веб-разработка",
    description: c["site.description"] ?? undefined,
    inLanguage: "ru-RU",
  };

  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text">
        {children}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}', 'ym');ym(${YANDEX_METRIKA_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
