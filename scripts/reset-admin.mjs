// Reset (or create) the admin user in data/site.db.
// Defaults to login "admin" / password "admin". Override only via shell env:
//   ADMIN_LOGIN=foo ADMIN_PASSWORD=bar node scripts/reset-admin.mjs
// Intentionally does NOT read .env - this script's job is to reset to a known
// value, not to re-apply whatever password is sitting in .env.
import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";
import path from "node:path";
import fs from "node:fs";

const ROOT = process.cwd();
const login = process.env.ADMIN_LOGIN || "admin";
const password = process.env.ADMIN_PASSWORD || "admin";

const dbPath = path.join(ROOT, "data", "site.db");
if (!fs.existsSync(dbPath)) {
  console.error(`Database not found at ${dbPath}. Run "npm run db:init" first.`);
  process.exit(1);
}

const db = new DatabaseSync(dbPath);
const hash = bcrypt.hashSync(password, 10);
const upd = db
  .prepare("UPDATE admin_users SET password_hash = ? WHERE login = ?")
  .run(hash, login);
if (upd.changes === 0) {
  db.prepare("INSERT INTO admin_users (login, password_hash) VALUES (?, ?)").run(login, hash);
  console.log(`Created admin user: ${login}`);
} else {
  console.log(`Password reset for admin user: ${login}`);
}
db.close();
