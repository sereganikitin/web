// Diagnostic: list admin users and check whether the stored hash matches "admin".
// Usage: node scripts/verify-admin.mjs   (run from project root)
import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";
import path from "node:path";

const dbPath = path.join(process.cwd(), "data", "site.db");
const db = new DatabaseSync(dbPath);
const rows = db.prepare("SELECT id, login, password_hash FROM admin_users").all();
console.log("db:", dbPath);
console.log("rows:", rows.length);
for (const r of rows) {
  const matches = bcrypt.compareSync("admin", r.password_hash);
  console.log(
    `#${r.id} login="${r.login}" hashPrefix=${r.password_hash.slice(0, 7)} hashLen=${r.password_hash.length} matchesAdmin=${matches}`
  );
}
db.close();
