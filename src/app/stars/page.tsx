import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";
import { listStars } from "@/lib/stars";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Звёздная парковка",
  robots: { index: false, follow: false },
};

export default function StarsPage() {
  const c = getContent();
  const stars = listStars({ publishedOnly: true });

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="container-site py-10">
          <div className="eyebrow mb-3 flex items-center gap-2">
            <span className="text-accent">★</span> Звёздная парковка
          </div>
          <h1 className="font-serif text-5xl leading-tight md:text-7xl">
            Дом, который <span className="text-accent">зажигает звёзды</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-text-muted md:text-lg">
            Знаменитые резиденты нашего жилого комплекса. Загляните в карточку
            каждого — внутри видео и история.
          </p>

          {stars.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-text/5 bg-bg-card p-10 text-center text-text-muted">
              Пока никого нет.
            </div>
          ) : (
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stars.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/stars/${s.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-text/5 bg-bg-card transition hover:border-accent/30 hover:bg-bg-elevated"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg">
                      {s.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.photo}
                          alt={s.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl text-text-dim">
                          ★
                        </div>
                      )}
                      {(s.video || s.video_embed) && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-bg/70 px-3 py-1 text-xs text-text backdrop-blur-sm">
                          ▶ видео
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="font-serif text-2xl text-accent">{s.name}</div>
                      {s.role && (
                        <div className="mt-2 text-sm text-text-muted">{s.role}</div>
                      )}
                      <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-text-dim transition group-hover:text-accent">
                        Открыть →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer copy={c["footer.copy"] ?? "© Сергей Никитин"} />
    </>
  );
}
