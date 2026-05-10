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
  "site.title": "Сергей Никитин — веб-разработка",
  "site.description":
    "Frontend и backend разработка. Создаю сайты любой сложности: лендинги, визитки, интернет-магазины.",

  "hero.eyebrow": "LIVE PREVIEW",
  "hero.title_line1": "Веб-разработчик",
  "hero.title_line2": "Frontend & backend",
  "hero.subtitle":
    "Frontend и backend разработка, создание сайтов любой сложности — от лендингов до интернет-магазинов.",
  "hero.cta_label": "Мои услуги",
  "hero.cta_href": "#services",
  "hero.image": "",

  "services.eyebrow": "Услуги",
  "services.s1.num": "01",
  "services.s1.title": "Frontend",
  "services.s1.text":
    "Современные интерфейсы на React, Next.js и TypeScript. Адаптив, анимации, оптимизация скорости.",
  "services.s2.num": "02",
  "services.s2.title": "Backend",
  "services.s2.text":
    "API на Node.js, PHP, базы данных, интеграции с CRM, платёжными системами и сторонними сервисами.",
  "services.s3.num": "03",
  "services.s3.title": "Под ключ",
  "services.s3.text":
    "Лендинги, визитки, корпоративные сайты, интернет-магазины. От проектирования до запуска и поддержки.",

  "work.eyebrow": "Selected",
  "work.title": "Работы",

  "about.eyebrow": "Обо мне",
  "about.title": "Сергей Никитин",
  "about.text":
    "Веб-разработчик с опытом от лендингов до e-commerce. Делаю быстрые, удобные и надёжные сайты — от идеи до продакшена. Работаю с современным стеком: React/Next.js, Node.js, TypeScript, базами данных и облачными сервисами.",

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
