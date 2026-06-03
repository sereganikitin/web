import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkCard from "@/components/WorkCard";
import { getContent, listPortfolio } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Работы — портфолио веб-разработчика Сергея Никитина",
  description:
    "Все мои проекты: сайты, интернет-магазины, личные кабинеты, Telegram-боты и интеграции. Москва.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Работы — Сергей Никитин",
    description: "Все мои проекты: сайты, e-commerce, личные кабинеты, боты, интеграции.",
    type: "website",
    locale: "ru_RU",
    url: "/portfolio",
  },
  robots: { index: true, follow: true },
};

export default function PortfolioIndex() {
  const c = getContent();
  const items = listPortfolio({ publishedOnly: true });

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="container-site pb-14 md:pb-20">
          <nav aria-label="Хлебные крошки">
            <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-text-muted">
              <li>
                <Link href="/" className="hover:text-accent">
                  Главная
                </Link>
              </li>
              <li className="text-text-dim">/</li>
              <li className="text-text">Работы</li>
            </ol>
          </nav>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-serif text-4xl leading-tight md:text-6xl">
              Все <span className="italic text-accent">работы</span>
            </h1>
            <div className="text-base text-text-muted">
              Всего проектов: {items.length}
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-base text-text-muted">
            Сайты, интернет-магазины, личные кабинеты, Telegram-боты и интеграции.
            Каждый кейс — с задачей, решением и стеком.
          </p>

          {items.length === 0 ? (
            <p className="mt-12 text-text-muted">Скоро здесь появятся проекты.</p>
          ) : (
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {items.map((p) => (
                <WorkCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer copy={c["footer.copy"] ?? "© Сергей Никитин"} />
    </>
  );
}
