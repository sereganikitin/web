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
