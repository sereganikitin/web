import "server-only";
import { db, type Star } from "./db";

export function listStars(opts: { publishedOnly?: boolean } = {}): Star[] {
  const where = opts.publishedOnly ? "WHERE is_published = 1" : "";
  return db
    .prepare(`SELECT * FROM stars ${where} ORDER BY position ASC, id ASC`)
    .all() as Star[];
}

export function getStar(id: number): Star | undefined {
  return db.prepare("SELECT * FROM stars WHERE id = ?").get(id) as
    | Star
    | undefined;
}

export function getStarBySlug(slug: string): Star | undefined {
  return db.prepare("SELECT * FROM stars WHERE slug = ?").get(slug) as
    | Star
    | undefined;
}

export function createStar(
  star: Omit<Star, "id" | "created_at" | "updated_at">
): number {
  const r = db
    .prepare(
      `INSERT INTO stars (slug, name, role, text, photo, video, video_embed, position, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      star.slug,
      star.name,
      star.role,
      star.text,
      star.photo,
      star.video,
      star.video_embed,
      star.position,
      star.is_published
    );
  return Number(r.lastInsertRowid);
}

type SqlValue = string | number | bigint | null | Uint8Array;

export function updateStar(
  id: number,
  star: Partial<Omit<Star, "id" | "created_at">>
): void {
  const fields: string[] = [];
  const values: SqlValue[] = [];
  for (const [k, v] of Object.entries(star)) {
    fields.push(`${k} = ?`);
    values.push(v as SqlValue);
  }
  if (!fields.length) return;
  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);
  db.prepare(`UPDATE stars SET ${fields.join(", ")} WHERE id = ?`).run(...values);
}

export function deleteStar(id: number): void {
  db.prepare("DELETE FROM stars WHERE id = ?").run(id);
}

/**
 * Нормализует внешнюю ссылку на видео в embed-форму для <iframe>.
 * Поддержка YouTube / VK / Rutube; остальное возвращается как есть.
 */
export function videoEmbedUrl(raw: string): string {
  const url = (raw || "").trim();
  if (!url) return "";

  // YouTube: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID
  const yt =
    url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Rutube: rutube.ru/video/ID/ → rutube.ru/play/embed/ID
  const rt = url.match(/rutube\.ru\/(?:video|play\/embed)\/([\w-]+)/);
  if (rt) return `https://rutube.ru/play/embed/${rt[1]}`;

  // VK: vk.com/video-OWNER_ID или vkvideo.ru/video-OWNER_ID
  const vk = url.match(/(?:vk\.com|vkvideo\.ru)\/video(-?\d+)_(\d+)/);
  if (vk) {
    return `https://vk.com/video_ext.php?oid=${vk[1]}&id=${vk[2]}&hd=2`;
  }

  // Уже embed-ссылка или неизвестный хостинг - отдаём как есть.
  return url;
}
