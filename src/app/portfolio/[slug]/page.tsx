import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContent, getPortfolioBySlug, listPortfolio } from "@/lib/content";

export const dynamic = "force-dynamic";

function parseGallery(raw: string): string[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolioBySlug(slug);
  if (!item) return { title: "Проект не найден" };
  return {
    title: `${item.title} — Сергей Никитин`,
    description: item.description || undefined,
    alternates: { canonical: `/portfolio/${item.slug}` },
    openGraph: {
      title: item.title,
      description: item.description,
      type: "article",
      locale: "ru_RU",
      url: `/portfolio/${item.slug}`,
      images: item.image ? [item.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: item.image ? [item.image] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getPortfolioBySlug(slug);
  if (!item || !item.is_published) notFound();

  const c = getContent();
  const gallery = parseGallery(item.gallery);

  // Prev/next navigation
  const all = listPortfolio({ publishedOnly: true });
  const idx = all.findIndex((p) => p.id === item.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <>
      <Header />
      <main className="pt-32">
        <article>
          <header className="container-site py-10">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted transition hover:text-accent"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-text/10">
                ←
              </span>
              Все работы
            </Link>

            <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                {item.category && (
                  <div className="eyebrow mb-3">{item.category}</div>
                )}
                <h1 className="font-serif text-5xl leading-tight md:text-7xl">
                  <span className="italic text-accent">{item.title}</span>
                </h1>
                {item.description && (
                  <p className="mt-6 max-w-xl text-base text-text-muted md:text-lg">
                    {item.description}
                  </p>
                )}
              </div>

              <dl className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm md:text-right">
                {item.client && (
                  <>
                    <dt className="text-xs uppercase tracking-wider text-text-dim">
                      Клиент
                    </dt>
                    <dd className="text-text">{item.client}</dd>
                  </>
                )}
                {item.year && (
                  <>
                    <dt className="text-xs uppercase tracking-wider text-text-dim">
                      Год
                    </dt>
                    <dd className="text-text">{item.year}</dd>
                  </>
                )}
                {item.link && (
                  <>
                    <dt className="text-xs uppercase tracking-wider text-text-dim">
                      Сайт
                    </dt>
                    <dd>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-accent hover:underline"
                      >
                        Открыть ↗
                      </a>
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </header>

          {item.image && (
            <div className="container-site">
              <div className="overflow-hidden rounded-2xl border border-text/5 bg-bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          )}

          {item.content && (
            <section className="container-site py-16">
              <div className="mx-auto max-w-3xl whitespace-pre-line text-base leading-relaxed text-text-muted md:text-lg">
                {item.content}
              </div>
            </section>
          )}

          {gallery.length > 0 && (
            <section className="container-site pb-16">
              <div className="grid gap-4 md:grid-cols-2">
                {gallery.map((src, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-text/5 bg-bg-card"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${item.title} — ${i + 1}`}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <nav className="border-t border-text/5">
            <div className="container-site grid gap-4 py-10 md:grid-cols-2">
              {prev ? (
                <Link
                  href={`/portfolio/${prev.slug}`}
                  className="group rounded-2xl border border-text/5 bg-bg-card p-6 transition hover:border-accent/30 hover:bg-bg-elevated"
                >
                  <div className="text-xs uppercase tracking-wider text-text-dim">
                    ← Предыдущий
                  </div>
                  <div className="mt-2 font-serif text-2xl">
                    <span className="italic text-accent">{prev.title}</span>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/portfolio/${next.slug}`}
                  className="group rounded-2xl border border-text/5 bg-bg-card p-6 text-right transition hover:border-accent/30 hover:bg-bg-elevated"
                >
                  <div className="text-xs uppercase tracking-wider text-text-dim">
                    Следующий →
                  </div>
                  <div className="mt-2 font-serif text-2xl">
                    <span className="italic text-accent">{next.title}</span>
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        </article>
      </main>
      <Footer copy={c["footer.copy"] ?? "© Сергей Никитин"} />
    </>
  );
}
