import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";
import { LEGAL } from "@/lib/legal";

const SITE_URL = process.env.SITE_URL ?? "https://cd-agency.ru";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Обо мне - Сергей Никитин, веб-разработчик с опытом 5+ лет",
  description:
    "Сергей Никитин - веб-разработчик, опыт 5+ лет. Стек: Next.js, React, TypeScript, Node.js, Python, WordPress. Делаю сайты, Telegram-боты и интеграции с CRM недорого и под ключ. Без бумажной волокиты.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Обо мне - Сергей Никитин",
    description:
      "Веб-разработчик, опыт 5+ лет. Стек, принципы работы, как заказать сайт под ключ.",
    type: "profile",
    locale: "ru_RU",
    url: "/about",
  },
  robots: { index: true, follow: true },
};

const STACK = [
  { name: "Next.js", desc: "React-фреймворк с SSR, SSG и кэшированием. Основной инструмент для сайтов и веб-приложений." },
  { name: "React", desc: "Библиотека UI. База для интерактивных интерфейсов и компонентов." },
  { name: "TypeScript", desc: "Строгая типизация JavaScript. Меньше багов в продакшене." },
  { name: "Node.js", desc: "Серверный JavaScript. API, бэкенд для сайтов и Telegram-ботов." },
  { name: "Python", desc: "Бэкенд, обработка данных, Telegram-боты на aiogram." },
  { name: "WordPress", desc: "CMS для контентных и e-commerce проектов. Кастомные темы и плагины." },
  { name: "PostgreSQL / SQLite", desc: "Реляционные базы данных. От компактных до нагруженных систем." },
  { name: "Tailwind CSS", desc: "Утилитарный CSS-фреймворк. Быстрая адаптивная вёрстка." },
  { name: "REST / Webhooks", desc: "Интеграции с CRM, платёжными системами, 1С, сервисами доставки." },
  { name: "Linux / nginx / PM2", desc: "VPS, reverse proxy, мониторинг процессов. Деплой и поддержка." },
];

const HOW_TO_STEPS = [
  {
    name: "Бриф",
    text: "Созваниваемся или переписываемся. Обсуждаем задачу, цели, аудиторию, ориентиры по дизайну и бюджету. Бесплатно и ни к чему не обязывает.",
  },
  {
    name: "Оценка и план",
    text: "Пришлю смету по этапам и срок. Если задача нестандартная - разобью на части, чтобы оценка была реалистичной.",
  },
  {
    name: "Дизайн и согласование",
    text: "Если нужен дизайн - делаю прототипы и финальные макеты. Если есть готовый - сразу к разработке.",
  },
  {
    name: "Разработка",
    text: "Веду проект на GitHub, показываю промежуточные результаты на тестовом домене. Обратная связь в Telegram - отвечаю быстро.",
  },
  {
    name: "Запуск и поддержка",
    text: "Деплой на ваш сервер или мой VPS. Настройка домена, SSL, аналитики. После запуска - поддержка по договору или почасово.",
  },
];

const PRINCIPLES = [
  {
    title: "Без коробочных решений",
    text: "Не использую Тильду и шаблонные конструкторы - там, где они не справятся. Если задача сложнее лендинга - нужен живой код, иначе через год сайт станет тупиком.",
  },
  {
    title: "Производительность по умолчанию",
    text: "Все сайты делаю с SSR/SSG, оптимизацией изображений и кэшированием. Lighthouse 95+, быстрая загрузка на 4G и слабых устройствах.",
  },
  {
    title: "Понятная админка",
    text: "Если клиенту нужно самому обновлять контент - делаю админку под его процессы. Без 200 ненужных полей, как в типовых CMS.",
  },
  {
    title: "Прозрачность",
    text: "Все правки видны в git-истории, доступ к коду остаётся у вас. Никаких чёрных ящиков и привязки к одному подрядчику.",
  },
];

export default function AboutPage() {
  const c = getContent();
  const photo = c["hero.image"] || undefined;

  // WebPage с speakable, lastReviewed - для голосовых ассистентов и AI.
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/about`,
    url: `${SITE_URL}/about`,
    name: "Обо мне - Сергей Никитин",
    description:
      "Веб-разработчик, опыт 5+ лет. Стек, принципы работы, как заказать сайт под ключ - недорого, быстро и без бумажной волокиты.",
    inLanguage: "ru-RU",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    mainEntity: { "@id": `${SITE_URL}/#person` },
    lastReviewed: new Date().toISOString().slice(0, 10),
    primaryImageOfPage: photo
      ? { "@type": "ImageObject", url: new URL(photo, SITE_URL).toString() }
      : undefined,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".speakable"],
    },
    breadcrumb: { "@id": `${SITE_URL}/about#breadcrumb` },
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/about#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Обо мне", item: `${SITE_URL}/about` },
    ],
  };

  // DefinedTermSet - глоссарий технологий. AI-движки любят такие списки.
  const stackLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Технологический стек",
    description: "Инструменты, с которыми я работаю на проектах.",
    hasDefinedTerm: STACK.map((s) => ({
      "@type": "DefinedTerm",
      name: s.name,
      description: s.desc,
      inDefinedTermSet: `${SITE_URL}/about#stack`,
    })),
  };

  // HowTo - пошаговая инструкция «Как заказать сайт». Рисует в выдаче
  // развёрнутый сниппет, AI цитирует шаги в ответах.
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Как заказать сайт у Сергея Никитина",
    description:
      "Пошаговый процесс работы: от первого созвона до запуска и поддержки.",
    estimatedCost: { "@type": "MonetaryAmount", currency: "RUB", value: "30000" },
    totalTime: "P14D",
    step: HOW_TO_STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  return (
    <>
      <Header />
      <main className="pt-32">
        <article className="container-site max-w-4xl pb-14">
          <nav aria-label="Хлебные крошки">
            <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-text-muted">
              <li>
                <Link href="/" className="hover:text-accent">
                  Главная
                </Link>
              </li>
              <li className="text-text-dim">/</li>
              <li className="text-text">Обо мне</li>
            </ol>
          </nav>

          {/* Hero */}
          <header className="mt-10 grid items-start gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="eyebrow mb-4">Обо мне</div>
              <h1 className="font-serif text-4xl leading-tight md:text-6xl">
                <span className="text-accent">Сергей Никитин</span>
              </h1>
              <div className="speakable mt-4 text-base text-text-muted">
                Веб-разработчик . Делаю сайты любой сложности,
                Telegram-боты и интеграции - от первой строки кода до запуска
                и поддержки.
              </div>
              <p className="mt-6 text-base leading-relaxed text-text-muted">
                Работаю с предпринимателями, агентствами и стартапами. Делаю
                проекты под ключ - беру задачу, разбираю её на части, согласовываю
                смету, разрабатываю и сопровождаю после запуска. Подхожу как
                инженер: если что-то можно автоматизировать или ускорить, делаю
                это, а не оставляю на потом.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="/#contacts" className="btn-accent">
                  Обсудить проект
                </a>
                <Link href="/uslugi" className="btn-outline">
                  Услуги и цены
                </Link>
              </div>
            </div>

            {photo && (
              <div className="md:col-span-5">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-text/5 bg-bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt="Сергей Никитин - веб-разработчик"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </header>

          {/* Стек */}
          <section className="mt-16" id="stack">
            <h2 className="font-serif text-3xl md:text-4xl">
              Технологический <span className="text-accent">стек</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base text-text-muted">
              С чем работаю каждый день. Стек подбираю под задачу, а не наоборот.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {STACK.map((s) => (
                <div
                  key={s.name}
                  className="rounded-2xl border border-text/5 bg-bg-card p-5"
                >
                  <div className="text-base font-medium text-text">{s.name}</div>
                  <div className="mt-1 text-sm text-text-muted">{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Принципы */}
          <section className="mt-16">
            <h2 className="font-serif text-3xl md:text-4xl">
              Принципы <span className="text-accent">работы</span>
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {PRINCIPLES.map((p, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-text/5 bg-bg-card p-6"
                >
                  <div className="text-xs text-text-dim">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-3 text-lg font-medium">{p.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-text-muted">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* HowTo: как заказать */}
          <section className="mt-16">
            <h2 className="font-serif text-3xl md:text-4xl">
              Как <span className="text-accent">заказать сайт</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base text-text-muted">
              Пошаговый процесс от первого созвона до запуска. Старт - бесплатный
              и ни к чему не обязывает.
            </p>
            <ol className="mt-8 space-y-3">
              {HOW_TO_STEPS.map((s, i) => (
                <li
                  key={i}
                  className="flex gap-5 rounded-2xl border border-text/5 bg-bg-card p-6"
                >
                  <div className="font-serif text-3xl text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="text-lg font-medium">{s.name}</div>
                    <p className="mt-2 text-base text-text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <section className="mt-16">
            <div className="rounded-2xl border border-accent/30 bg-bg-card p-8 text-center md:p-12">
              <h2 className="font-serif text-3xl md:text-4xl">
                Готовы <span className="text-accent">обсудить проект?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-text-muted">
                Расскажите о задаче - отвечу в течение дня, посчитаю стоимость
                и сроки. Бесплатно.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a href="/#contacts" className="btn-accent">
                  Оставить заявку
                </a>
                <a href={`tel:${LEGAL.phone}`} className="btn-outline">
                  {LEGAL.phoneDisplay}
                </a>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer copy={c["footer.copy"] ?? "© Сергей Никитин"} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stackLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
    </>
  );
}
