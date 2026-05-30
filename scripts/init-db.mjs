// Initialize SQLite schema and seed default content + admin user.
// Run: npm run db:init
import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Lightweight .env loader (no external dep)
const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

const DATA_DIR = path.join(ROOT, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, "site.db"));
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
CREATE TABLE IF NOT EXISTS content (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  content      TEXT NOT NULL DEFAULT '',
  gallery      TEXT NOT NULL DEFAULT '[]',
  client       TEXT NOT NULL DEFAULT '',
  year         TEXT NOT NULL DEFAULT '',
  image        TEXT,
  link         TEXT,
  position     INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_logos (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT NOT NULL,
  image    TEXT NOT NULL,
  link     TEXT,
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  login         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL DEFAULT '',
  contact    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL DEFAULT '',
  source     TEXT NOT NULL DEFAULT 'contacts',
  is_read    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);

CREATE TABLE IF NOT EXISTS services (
  slug             TEXT PRIMARY KEY,
  position         INTEGER NOT NULL DEFAULT 0,
  meta_title       TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  card_title       TEXT NOT NULL DEFAULT '',
  card_summary     TEXT NOT NULL DEFAULT '',
  card_keywords    TEXT NOT NULL DEFAULT '[]',
  eyebrow          TEXT NOT NULL DEFAULT '',
  h1               TEXT NOT NULL DEFAULT '',
  intro            TEXT NOT NULL DEFAULT '',
  includes         TEXT NOT NULL DEFAULT '[]',
  pricing          TEXT NOT NULL DEFAULT '{}',
  faq              TEXT NOT NULL DEFAULT '[]',
  case_slugs       TEXT NOT NULL DEFAULT '[]',
  updated_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

// Migrations: add columns introduced after the initial schema (idempotent).
const portfolioCols = db.prepare("PRAGMA table_info(portfolio)").all().map((c) => c.name);
const ensureCol = (name, ddl) => {
  if (!portfolioCols.includes(name)) db.exec(`ALTER TABLE portfolio ADD COLUMN ${ddl}`);
};
ensureCol("content", "content TEXT NOT NULL DEFAULT ''");
ensureCol("gallery", "gallery TEXT NOT NULL DEFAULT '[]'");
ensureCol("client", "client TEXT NOT NULL DEFAULT ''");
ensureCol("year", "year TEXT NOT NULL DEFAULT ''");

const defaults = {
  "site.title": "Сергей Никитин — веб-разработчик в Москве",
  "site.description":
    "Разработка сайтов любой сложности в Москве: лендинги, визитки, корпоративные сайты, интернет-магазины, Telegram-боты. Сайты на Next.js, React, Node.js, Python. Интеграции с CRM. Полный спектр услуг по web.",

  "hero.eyebrow": "Веб-разработчик в Москве",
  "hero.title_line1": "Сайты любой",
  "hero.title_line2": "сложности",
  "hero.subtitle":
    "Лендинги, корпоративные сайты, интернет-магазины и Telegram-боты. Сайты на Next.js, React, Node.js, Python. Интеграции с CRM. Полный спектр услуг по web — недорого и под ключ.",
  "hero.cta_label": "Мои услуги",
  "hero.cta_href": "#services",
  "hero.image": "",

  "services.eyebrow": "Услуги",
  "services.s1.num": "01",
  "services.s1.title": "Сайты под ключ",
  "services.s1.text":
    "Лендинги, сайты-визитки, корпоративные сайты и интернет-магазины. Разработка с нуля на Next.js, React, Python — от проектирования до запуска и поддержки. Можно недорого.",
  "services.s2.num": "02",
  "services.s2.title": "Интеграции и API",
  "services.s2.text":
    "Подключение сайта к CRM (amoCRM, Битрикс24, RetailCRM), платёжным системам, сервисам доставки и аналитике. API на Node.js и Python.",
  "services.s3.num": "03",
  "services.s3.title": "Telegram-боты",
  "services.s3.text":
    "Боты для приёма заявок, продаж, поддержки и автоматизации. Связка с сайтом и CRM. Полный спектр услуг по web — на одном стеке.",

  "work.eyebrow": "Selected",
  "work.title": "Работы",

  "about.eyebrow": "Обо мне",
  "about.title": "Сергей Никитин",
  "about.text":
    "Веб-разработчик из Москвы. Делаю сайты любой сложности — от лендингов до e-commerce и Telegram-ботов. Работаю с современным стеком: Next.js, React, Node.js, Python, TypeScript, базы данных, облачные сервисы. Подключаю CRM-системы и платёжные сервисы. Беру задачи под ключ — от идеи до продакшена и поддержки.",

  "contacts.eyebrow": "Контакты",
  "contacts.title": "Свяжитесь со мной",
  "contacts.text":
    "Готов обсудить ваш проект. Напишите удобным способом — отвечу в течение дня.",
  "contacts.email": "hello@cd-agency.ru",
  "contacts.phone": "+7 (000) 000-00-00",
  "contacts.telegram": "https://t.me/",
  "contacts.whatsapp": "https://wa.me/",
  "contacts.github": "https://github.com/",

  "footer.copy": "© Сергей Никитин",
};

const upsert = db.prepare(
  "INSERT INTO content (key, value) VALUES (?, ?) ON CONFLICT(key) DO NOTHING"
);
for (const [k, v] of Object.entries(defaults)) upsert.run(k, v);

const portfolioCount = db.prepare("SELECT COUNT(*) as c FROM portfolio").get();
if (portfolioCount.c === 0) {
  const insert = db.prepare(
    "INSERT INTO portfolio (slug, title, category, description, image, link, position) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  const samples = [
    ["space", "Space", "Лендинг", "Лендинг для технологического стартапа.", null, null, 1],
    ["nova", "Nova", "Корпоративный сайт", "Корпоративный сайт с админкой и блогом.", null, null, 2],
    ["sonic", "Sonic", "Интернет-магазин", "E-commerce с интеграцией платежей.", null, null, 3],
    ["solar", "Solar", "Промо-сайт", "Промо-сайт продукта с анимациями.", null, null, 4],
  ];
  for (const s of samples) insert.run(...s);
}

const adminLogin = process.env.ADMIN_LOGIN || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "admin";
const existing = db
  .prepare("SELECT id FROM admin_users WHERE login = ?")
  .get(adminLogin);
if (!existing) {
  const hash = bcrypt.hashSync(adminPassword, 10);
  db.prepare("INSERT INTO admin_users (login, password_hash) VALUES (?, ?)").run(
    adminLogin,
    hash
  );
  console.log(`Admin user "${adminLogin}" created.`);
} else {
  console.log(`Admin user "${adminLogin}" already exists — skipped.`);
}

console.log("Database initialized at:", path.join(DATA_DIR, "site.db"));
db.close();
