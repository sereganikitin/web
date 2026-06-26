import { DatabaseSync, type StatementSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "site.db");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

declare global {
  // eslint-disable-next-line no-var
  var __db: DatabaseSync | undefined;
}

function open(): DatabaseSync {
  const d = new DatabaseSync(DB_PATH);
  d.exec("PRAGMA journal_mode = WAL;");
  d.exec("PRAGMA foreign_keys = ON;");
  return d;
}

export const db: DatabaseSync = global.__db ?? open();
if (process.env.NODE_ENV !== "production") global.__db = db;

export type { StatementSync };

export type ContentBlock = {
  key: string;
  value: string;
  updated_at: string;
};

export type PortfolioItem = {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  content: string;
  gallery: string;
  client: string;
  year: string;
  image: string | null;
  link: string | null;
  position: number;
  is_published: number;
  created_at: string;
  updated_at: string;
};

export type Star = {
  id: number;
  slug: string;
  name: string;
  role: string;
  text: string;
  photo: string | null;
  video: string | null;
  video_embed: string | null;
  position: number;
  is_published: number;
  created_at: string;
  updated_at: string;
};

export type ClientLogo = {
  id: number;
  name: string;
  image: string;
  link: string | null;
  position: number;
};

export type AdminUser = {
  id: number;
  login: string;
  password_hash: string;
};

export type Lead = {
  id: number;
  name: string;
  contact: string;
  message: string;
  source: "contacts" | "popup" | string;
  is_read: number;
  created_at: string;
};

// Service row - массивы/объекты хранятся как JSON-строки в TEXT-полях.
// Раскрытие в ServiceContent делает lib/services.ts.
export type ServiceRow = {
  slug: string;
  position: number;
  meta_title: string;
  meta_description: string;
  card_title: string;
  card_summary: string;
  card_keywords: string; // JSON string[]
  eyebrow: string;
  h1: string;
  intro: string;
  includes: string; // JSON {title, text}[]
  pricing: string; // JSON {priceFrom, deadline, note?}
  faq: string; // JSON {q, a}[]
  case_slugs: string; // JSON string[]
  updated_at: string;
};
