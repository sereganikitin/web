import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContent, getPortfolioBySlug } from "@/lib/content";
import { listServices, getServiceBySlug } from "@/lib/services";
import { LEGAL } from "@/lib/legal";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL ?? "https://web.cd-agency.ru";

export function generateStaticParams() {
  return listServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = getServiceBySlug(slug);
  if (!svc) return { title: "Услуга не найдена" };
  return {
    title: svc.metaTitle,
    description: svc.metaDescription,
    keywords: svc.cardKeywords,
    alternates: { canonical: `/uslugi/${svc.slug}` },
    openGraph: {
      title: svc.metaTitle,
      description: svc.metaDescription,
      type: "website",
      locale: "ru_RU",
      url: `/uslugi/${svc.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: svc.metaTitle,
      description: svc.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = getServiceBySlug(slug);
  if (!svc) notFound();

  const c = getContent();
  const cases = (svc.caseSlugs ?? [])
    .map((s) => getPortfolioBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p && p.is_published));

  // JSON-LD: BreadcrumbList
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Услуги", item: `${SITE_URL}/uslugi` },
      {
        "@type": "ListItem",
        position: 3,
        name: svc.cardTitle,
        item: `${SITE_URL}/uslugi/${svc.slug}`,
      },
    ],
  };

  // JSON-LD: FAQPage
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: svc.faq.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    })),
  };

  // JSON-LD: Service
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.cardTitle,
    description: svc.metaDescription,
    provider: {
      "@type": "ProfessionalService",
      name: LEGAL.entity,
      url: SITE_URL,
      areaServed: { "@type": "City", name: LEGAL.city },
      telephone: LEGAL.phone,
      email: LEGAL.email,
    },
    areaServed: { "@type": "City", name: LEGAL.city },
    serviceType: svc.cardTitle,
    offers: {
      "@type": "Offer",
      price: svc.pricing.priceFrom.replace(/[^\d]/g, "") || undefined,
      priceCurrency: "RUB",
      url: `${SITE_URL}/uslugi/${svc.slug}`,
    },
  };

  return (
    <>
      <Header />
      <main className="pt-32">
        <article>
          {/* Хлебные крошки */}
          <nav aria-label="Хлебные крошки" className="container-site">
            <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-text-muted">
              <li>
                <Link href="/" className="hover:text-accent">
                  Главная
                </Link>
              </li>
              <li className="text-text-dim">/</li>
              <li>
                <Link href="/uslugi" className="hover:text-accent">
                  Услуги
                </Link>
              </li>
              <li className="text-text-dim">/</li>
              <li className="text-text">{svc.cardTitle}</li>
            </ol>
          </nav>

          {/* Hero */}
          <header className="container-site mt-10 pb-10">
            <div className="eyebrow mb-4">{svc.eyebrow}</div>
            <h1 className="font-serif text-4xl leading-tight md:text-6xl">
              <span className="italic text-accent">{svc.h1}</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-text-muted">
              {svc.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="/#contacts" className="btn-accent">
                Обсудить проект
              </a>
              <a href={`tel:${LEGAL.phone}`} className="btn-outline">
                {LEGAL.phoneDisplay}
              </a>
            </div>
          </header>

          {/* Что входит */}
          <section className="container-site py-14">
            <h2 className="font-serif text-3xl md:text-4xl">
              Что <span className="italic text-accent">входит</span>
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {svc.includes.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-text/5 bg-bg-card p-6"
                >
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-text-muted">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Стоимость и сроки */}
          <section className="container-site py-14">
            <h2 className="font-serif text-3xl md:text-4xl">
              Стоимость и <span className="italic text-accent">сроки</span>
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-accent/30 bg-bg-card p-6">
                <div className="text-xs uppercase tracking-wider text-text-dim">
                  Цена
                </div>
                <div className="mt-2 font-serif text-3xl text-accent">
                  {svc.pricing.priceFrom}
                </div>
              </div>
              <div className="rounded-2xl border border-text/5 bg-bg-card p-6">
                <div className="text-xs uppercase tracking-wider text-text-dim">
                  Срок
                </div>
                <div className="mt-2 font-serif text-3xl">{svc.pricing.deadline}</div>
              </div>
              {svc.pricing.note && (
                <div className="rounded-2xl border border-text/5 bg-bg-card p-6 text-sm text-text-muted">
                  {svc.pricing.note}
                </div>
              )}
            </div>
          </section>

          {/* Примеры из портфолио */}
          {cases.length > 0 && (
            <section className="container-site py-14">
              <h2 className="font-serif text-3xl md:text-4xl">
                Примеры <span className="italic text-accent">работ</span>
              </h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {cases.map((p) => (
                  <Link
                    key={p.id}
                    href={`/portfolio/${p.slug}`}
                    className="group rounded-2xl border border-text/5 bg-bg-card p-6 transition hover:border-accent/30 hover:bg-bg-elevated"
                  >
                    <div className="text-xs uppercase tracking-wider text-text-dim">
                      {p.category}
                    </div>
                    <div className="mt-3 font-serif text-2xl">
                      <span className="italic text-accent">{p.title}</span>
                    </div>
                    {p.description && (
                      <p className="mt-2 text-base text-text-muted line-clamp-2">
                        {p.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="container-site py-14">
            <h2 className="font-serif text-3xl md:text-4xl">
              Частые <span className="italic text-accent">вопросы</span>
            </h2>
            <div className="mt-8 space-y-3">
              {svc.faq.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-text/5 bg-bg-card p-6 open:bg-bg-elevated"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-medium text-text md:text-lg">
                        {item.q}
                      </h3>
                      <span className="mt-1 text-accent transition group-open:rotate-45">
                        +
                      </span>
                    </div>
                  </summary>
                  <p className="mt-4 text-base leading-relaxed text-text-muted">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="container-site py-14">
            <div className="rounded-2xl border border-accent/30 bg-bg-card p-8 md:p-12 text-center">
              <h2 className="font-serif text-3xl md:text-4xl">
                Готовы <span className="italic text-accent">обсудить?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-text-muted">
                Расскажите о задаче — отвечу в течение дня, посчитаю стоимость
                и сроки. Это бесплатно и ни к чему не обязывает.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a href="/#contacts" className="btn-accent">
                  Оставить заявку
                </a>
                <a href={`tel:${LEGAL.phone}`} className="btn-outline">
                  Позвонить
                </a>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer copy={c["footer.copy"] ?? "© Сергей Никитин"} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
    </>
  );
}
