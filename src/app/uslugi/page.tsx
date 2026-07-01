import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";
import { listServices } from "@/lib/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Услуги - сайты от 40 000 ₽, Telegram-боты от 20 000 ₽ | Сергей Никитин",
  description:
    "Разработка сайтов недорого и под ключ: лендинги от 40 000 ₽, интернет-магазины от 150 000 ₽, Telegram-боты от 20 000 ₽, интеграция с CRM от 20 000 ₽. Опыт 5+ лет, стек Next.js/React/Python. Без бумажной волокиты - быстро и качественно.",
  alternates: { canonical: "/uslugi" },
  openGraph: {
    title: "Услуги - Сергей Никитин",
    description:
      "Лендинги от 40 000 ₽, магазины от 150 000 ₽, Telegram-боты от 20 000 ₽, интеграции с CRM. Без бумажной волокиты - быстро и под ключ.",
    type: "website",
    locale: "ru_RU",
    url: "/uslugi",
  },
  robots: { index: true, follow: true },
};

export default function UslugiIndex() {
  const c = getContent();
  const services = listServices();
  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="container-site pb-14 md:pb-20">
          <div className="eyebrow mb-6">Услуги</div>
          <h1 className="font-serif text-4xl leading-tight md:text-6xl">
            Что я <span className="text-accent">делаю</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-text-muted">
            Полный спектр услуг по web - от лендингов до крупных интернет-магазинов
            и Telegram-ботов. Работаю с современным стеком (Next.js, React, Node.js,
            Python) и любыми CRM. Без лишней бюрократии - быстро, под ключ.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/uslugi/${s.slug}`}
                className="group rounded-2xl border border-text/10 bg-bg-card p-7 shadow-lg shadow-black/40 transition hover:bg-bg-elevated hover:shadow-black/60"
              >
                <div className="text-xs text-text-dim">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-4 font-serif text-2xl">
                  <span className="text-accent">{s.cardTitle}</span>
                </h2>
                <p className="mt-3 text-base text-text-muted">{s.cardSummary}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted transition group-hover:text-accent">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-text/10 transition group-hover:border-accent">
                    →
                  </span>
                  Подробнее
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer copy={c["footer.copy"] ?? "© Сергей Никитин"} />
    </>
  );
}
