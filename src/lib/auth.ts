import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db, type AdminUser } from "./db";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-only-secret-change-me-please-32chars"
);
const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Session = { sub: string; login: string };

export async function createSession(user: AdminUser): Promise<string> {
  return await new SignJWT({ login: user.login })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

export async function readSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { sub: String(payload.sub), login: String(payload.login) };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export function verifyCredentials(login: string, password: string): AdminUser | null {
  const user = db
    .prepare("SELECT * FROM admin_users WHERE login = ?")
    .get(login) as AdminUser | undefined;
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;
  return user;
}

export const SESSION_COOKIE = COOKIE_NAME;
export { SECRET as SESSION_SECRET };
