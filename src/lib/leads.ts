import "server-only";
import { db, type Lead } from "./db";

export function listLeads(opts: { limit?: number } = {}): Lead[] {
  const limit = opts.limit && opts.limit > 0 ? Math.min(opts.limit, 500) : 200;
  const rows = db
    .prepare(
      `SELECT * FROM leads ORDER BY created_at DESC, id DESC LIMIT ?`
    )
    .all(limit) as Lead[];
  return rows.map((r) => ({ ...r }));
}

export function countUnreadLeads(): number {
  const r = db.prepare("SELECT COUNT(*) as c FROM leads WHERE is_read = 0").get() as
    | { c: number }
    | undefined;
  return r?.c ?? 0;
}

export function createLead(input: {
  name: string;
  contact: string;
  message: string;
  source: string;
}): Lead {
  const r = db
    .prepare(
      "INSERT INTO leads (name, contact, message, source) VALUES (?, ?, ?, ?)"
    )
    .run(input.name, input.contact, input.message, input.source);
  return db
    .prepare("SELECT * FROM leads WHERE id = ?")
    .get(Number(r.lastInsertRowid)) as Lead;
}

export function markLeadRead(id: number, isRead: boolean): void {
  db.prepare("UPDATE leads SET is_read = ? WHERE id = ?").run(isRead ? 1 : 0, id);
}

export function deleteLead(id: number): void {
  db.prepare("DELETE FROM leads WHERE id = ?").run(id);
}
