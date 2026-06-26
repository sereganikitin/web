import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import StarNav from "@/components/StarNav";
import { getContent } from "@/lib/content";
import { getStarBySlug, listStars, videoEmbedUrl } from "@/lib/stars";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const star = getStarBySlug(slug);
  return {
    title: star ? star.name : "Звезда не найдена",
    robots: { index: false, follow: false },
  };
}

export default async function StarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const star = getStarBySlug(slug);
  if (!star || !star.is_published) notFound();

  const c = getContent();
  const all = listStars({ publishedOnly: true });
  const navStars = all.map((s) => ({ slug: s.slug, name: s.name }));

  const idx = all.findIndex((s) => s.id === star.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const embed = star.video_embed ? videoEmbedUrl(star.video_embed) : "";
  const hasMedia = Boolean(star.video || embed || star.photo);

  return (
    <>
      <StarNav stars={navStars} currentSlug={star.slug} />
      <main className="pt-28 md:pt-32">
        <article className="container-site">
          <Link
            href="/stars"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted transition hover:text-accent"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-text/10">
              ←
            </span>
            Звёздная парковка
          </Link>

          {/* Имя + амплуа */}
          <header className="mt-6 md:mt-10">
            <div className="eyebrow mb-3 flex items-center gap-2">
              <span className="text-accent">★</span> Звезда ЖК
            </div>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl md:text-7xl">
              <span className="text-accent">{star.name}</span>
            </h1>
            {star.role && (
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
                  {star.role}
                </span>
              </div>
            )}
          </header>

          {/* Медиа: видеофайл → embed → фото */}
          {hasMedia && (
            <div className="mt-7 md:mt-10">
              <div className="overflow-hidden rounded-2xl border border-text/5 bg-black">
                {star.video ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={star.video}
                    poster={star.photo ?? undefined}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-auto w-full"
                  />
                ) : embed ? (
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={embed}
                      title={star.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                ) : star.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={star.photo}
                    alt={star.name}
                    className="h-auto w-full object-cover"
                  />
                ) : null}
              </div>
            </div>
          )}

          {/* Текст под медиа */}
          {star.text && (
            <section className="py-10 md:py-14">
              <div className="mx-auto max-w-2xl whitespace-pre-line text-base leading-relaxed text-text-muted md:text-lg">
                {star.text}
              </div>
            </section>
          )}

          {/* Переключение между звёздами */}
          {(prev || next) && (
            <nav className="grid gap-4 border-t border-text/5 py-10 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/stars/${prev.slug}`}
                  className="group rounded-2xl border border-text/5 bg-bg-card p-6 transition hover:border-accent/30 hover:bg-bg-elevated"
                >
                  <div className="text-xs uppercase tracking-wider text-text-dim">
                    ← Предыдущая
                  </div>
                  <div className="mt-2 font-serif text-2xl">
                    <span className="text-accent">{prev.name}</span>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/stars/${next.slug}`}
                  className="group rounded-2xl border border-text/5 bg-bg-card p-6 text-right transition hover:border-accent/30 hover:bg-bg-elevated"
                >
                  <div className="text-xs uppercase tracking-wider text-text-dim">
                    Следующая →
                  </div>
                  <div className="mt-2 font-serif text-2xl">
                    <span className="text-accent">{next.name}</span>
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          )}
        </article>
      </main>
      <Footer copy={c["footer.copy"] ?? "© Сергей Никитин"} />
    </>
  );
}
