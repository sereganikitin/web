import { NextResponse } from "next/server";
import { createSession, setSessionCookie, verifyCredentials } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const login = String(body.login || "").trim();
  const password = String(body.password || "");
  if (!login || !password) {
    return NextResponse.json({ error: "Заполните логин и пароль" }, { status: 400 });
  }
  const user = verifyCredentials(login, password);
  if (!user) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }
  const token = await createSession(user);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
