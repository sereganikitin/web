import "server-only";
import { db, type ServiceRow } from "./db";
import { SERVICES as SEED, type ServiceContent } from "./services-content";

// Override caseSlugs to always be a string[] (DB always returns array,
// never undefined - proper match for forms and consumers).
export type Service = Omit<ServiceContent, "caseSlugs"> & {
  position: number;
  caseSlugs: string[];
};

function tryParse<T>(s: string, fallback: T): T {
  try {
    const v = JSON.parse(s);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function rowToService(r: ServiceRow): Service {
  return {
    slug: r.slug,
    position: r.position,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    cardTitle: r.card_title,
    cardSummary: r.card_summary,
    cardKeywords: tryParse<string[]>(r.card_keywords, []),
    eyebrow: r.eyebrow,
    h1: r.h1,
    intro: r.intro,
    includes: tryParse<{ title: string; text: string }[]>(r.includes, []),
    pricing: tryParse<ServiceContent["pricing"]>(r.pricing, {
      priceFrom: "",
      deadline: "",
    }),
    faq: tryParse<{ q: string; a: string }[]>(r.faq, []),
    caseSlugs: tryParse<string[]>(r.case_slugs, []),
  };
}

const COLUMNS = [
  "slug",
  "position",
  "meta_title",
  "meta_description",
  "card_title",
  "card_summary",
  "card_keywords",
  "eyebrow",
  "h1",
  "intro",
  "includes",
  "pricing",
  "faq",
  "case_slugs",
] as const;

function serviceToParams(s: Service): unknown[] {
  return [
    s.slug,
    s.position ?? 0,
    s.metaTitle ?? "",
    s.metaDescription ?? "",
    s.cardTitle ?? "",
    s.cardSummary ?? "",
    JSON.stringify(s.cardKeywords ?? []),
    s.eyebrow ?? "",
    s.h1 ?? "",
    s.intro ?? "",
    JSON.stringify(s.includes ?? []),
    JSON.stringify(s.pricing ?? { priceFrom: "", deadline: "" }),
    JSON.stringify(s.faq ?? []),
    JSON.stringify(s.caseSlugs ?? []),
  ];
}

function seedIfEmpty(): void {
  const row = db.prepare("SELECT COUNT(*) as c FROM services").get() as
    | { c: number }
    | undefined;
  if (!row || row.c > 0) return;
  const placeholders = COLUMNS.map(() => "?").join(", ");
  const stmt = db.prepare(
    `INSERT INTO services (${COLUMNS.join(", ")}) VALUES (${placeholders})`
  );
  SEED.forEach((s, i) => {
    const svc: Service = {
      ...s,
      caseSlugs: s.caseSlugs ?? [],
      position: i + 1,
    };
    stmt.run(...(serviceToParams(svc) as never[]));
  });
}

export function listServices(): Service[] {
  seedIfEmpty();
  const rows = db
    .prepare(
      `SELECT * FROM services ORDER BY position ASC, slug ASC`
    )
    .all() as ServiceRow[];
  return rows.map(rowToService);
}

export function getServiceBySlug(slug: string): Service | undefined {
  seedIfEmpty();
  const row = db
    .prepare("SELECT * FROM services WHERE slug = ?")
    .get(slug) as ServiceRow | undefined;
  return row ? rowToService(row) : undefined;
}

export function createService(s: Service): void {
  const placeholders = COLUMNS.map(() => "?").join(", ");
  db.prepare(
    `INSERT INTO services (${COLUMNS.join(", ")}) VALUES (${placeholders})`
  ).run(...(serviceToParams(s) as never[]));
}

export function updateService(originalSlug: string, s: Service): void {
  // slug can change - UPDATE matches by original slug then writes new values.
  const setClause = COLUMNS.map((c) => `${c} = ?`).join(", ");
  db.prepare(
    `UPDATE services SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`
  ).run(...(serviceToParams(s) as never[]), originalSlug);
}

export function deleteService(slug: string): void {
  db.prepare("DELETE FROM services WHERE slug = ?").run(slug);
}

// Обратная связка: для кейса из портфолио - список услуг, где он
// фигурирует в caseSlugs. Используется в блоке «Технологии в проекте»
// на /portfolio/[slug].
export function servicesForPortfolio(portfolioSlug: string): Service[] {
  return listServices().filter((s) => s.caseSlugs.includes(portfolioSlug));
}
