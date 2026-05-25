import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getContent } from "@/lib/content";
import CookieNotice from "@/components/CookieNotice";
import { LEGAL } from "@/lib/legal";
import { SERVICES } from "@/lib/services-content";

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

  // Person: E-E-A-T сигналы — экспертиза, специализации, контакты, аффилиация
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
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
    telephone: LEGAL.phone,
    address: { "@type": "PostalAddress", addressLocality: LEGAL.city, addressCountry: "RU" },
    workLocation: { "@type": "Place", name: LEGAL.city },
    knowsAbout: [
      "Веб-разработка",
      "Frontend разработка",
      "Backend разработка",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Python",
      "WordPress",
      "Разработка интернет-магазинов",
      "Разработка лендингов",
      "Разработка Telegram-ботов",
      "Интеграция с amoCRM",
      "Интеграция с Битрикс24",
      "Миграция сайтов",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Веб-разработчик",
      occupationLocation: { "@type": "City", name: LEGAL.city },
      skills:
        "Next.js, React, TypeScript, Node.js, Python, WordPress, SQL, REST API, интеграции CRM",
    },
  };

  // WebSite: общее описание сайта + SearchAction (для Sitelinks search box)
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: c["site.title"] ?? "Сергей Никитин — веб-разработка",
    description: c["site.description"] ?? undefined,
    inLanguage: "ru-RU",
    publisher: { "@id": `${SITE_URL}/#person` },
  };

  // ProfessionalService с офертой — главный schema для классического SEO
  // и GEO: AI-движки используют этот блок чтобы рассказывать о специалисте.
  const professionalServiceLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: LEGAL.entity,
    alternateName: "Сергей Никитин — веб-разработка",
    url: SITE_URL,
    image: c["hero.image"] ? new URL(c["hero.image"], SITE_URL).toString() : undefined,
    description: c["site.description"] ?? undefined,
    telephone: LEGAL.phone,
    email: LEGAL.email,
    priceRange: "₽₽",
    address: { "@type": "PostalAddress", addressLocality: LEGAL.city, addressCountry: "RU" },
    areaServed: [
      { "@type": "City", name: LEGAL.city },
      { "@type": "Country", name: "Россия" },
    ],
    founder: { "@id": `${SITE_URL}/#person` },
    identifier: [
      { "@type": "PropertyValue", propertyID: "ОГРНИП", value: LEGAL.ogrnip },
      { "@type": "PropertyValue", propertyID: "ИНН", value: LEGAL.inn },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги веб-разработки",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        url: `${SITE_URL}/uslugi/${s.slug}`,
        priceCurrency: "RUB",
        price: s.pricing.priceFrom.replace(/[^\d]/g, ""),
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "RUB",
          minPrice: s.pricing.priceFrom.replace(/[^\d]/g, ""),
        },
        itemOffered: {
          "@type": "Service",
          name: s.cardTitle,
          description: s.metaDescription,
          serviceType: s.cardTitle,
          provider: { "@id": `${SITE_URL}/#person` },
          areaServed: { "@type": "City", name: LEGAL.city },
        },
      })),
    },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceLd) }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text">
        {children}
        <CookieNotice />
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
