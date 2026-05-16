import "server-only";
import { db, type PortfolioItem, type ClientLogo } from "./db";

export function getContent(): Record<string, string> {
  const rows = db.prepare("SELECT key, value FROM content").all() as {
    key: string;
    value: string;
  }[];
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export function setContent(entries: Record<string, string>): void {
  const stmt = db.prepare(
    "INSERT INTO content (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP"
  );
  db.exec("BEGIN");
  try {
    for (const [k, v] of Object.entries(entries)) stmt.run(k, v);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

export function listPortfolio(opts: { publishedOnly?: boolean } = {}): PortfolioItem[] {
  const where = opts.publishedOnly ? "WHERE is_published = 1" : "";
  const rows = db
    .prepare(
      `SELECT * FROM portfolio ${where} ORDER BY position ASC, id ASC`
    )
    .all() as PortfolioItem[];
  return rows.map((r) => ({ ...r }));
}

export function getPortfolio(id: number): PortfolioItem | undefined {
  return db.prepare("SELECT * FROM portfolio WHERE id = ?").get(id) as
    | PortfolioItem
    | undefined;
}

export function getPortfolioBySlug(slug: string): PortfolioItem | undefined {
  return db.prepare("SELECT * FROM portfolio WHERE slug = ?").get(slug) as
    | PortfolioItem
    | undefined;
}

export function createPortfolio(item: Omit<PortfolioItem, "id" | "created_at" | "updated_at">): number {
  const r = db
    .prepare(
      `INSERT INTO portfolio (slug, title, category, description, content, gallery, client, year, image, link, position, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      item.slug,
      item.title,
      item.category,
      item.description,
      item.content,
      item.gallery,
      item.client,
      item.year,
      item.image,
      item.link,
      item.position,
      item.is_published
    );
  return Number(r.lastInsertRowid);
}

type SqlValue = string | number | bigint | null | Uint8Array;

export function updatePortfolio(id: number, item: Partial<Omit<PortfolioItem, "id" | "created_at">>): void {
  const fields: string[] = [];
  const values: SqlValue[] = [];
  for (const [k, v] of Object.entries(item)) {
    fields.push(`${k} = ?`);
    values.push(v as SqlValue);
  }
  if (!fields.length) return;
  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);
  db.prepare(`UPDATE portfolio SET ${fields.join(", ")} WHERE id = ?`).run(...values);
}

export function deletePortfolio(id: number): void {
  db.prepare("DELETE FROM portfolio WHERE id = ?").run(id);
}

export function listLogos(): ClientLogo[] {
  return db
    .prepare("SELECT * FROM client_logos ORDER BY position ASC, id ASC")
    .all() as ClientLogo[];
}

export function createLogo(logo: Omit<ClientLogo, "id">): number {
  const r = db
    .prepare(
      "INSERT INTO client_logos (name, image, link, position) VALUES (?, ?, ?, ?)"
    )
    .run(logo.name, logo.image, logo.link, logo.position);
  return Number(r.lastInsertRowid);
}

export function deleteLogo(id: number): void {
  db.prepare("DELETE FROM client_logos WHERE id = ?").run(id);
}

export function slugify(s: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
    щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return s
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
