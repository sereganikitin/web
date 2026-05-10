import { NextResponse } from "next/server";
import { readSession, updatePassword, verifyCredentials } from "@/lib/auth";

const MIN_LEN = 8;

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const current = String(body.current || "");
  const next = String(body.next || "");
  const confirm = String(body.confirm || "");

  if (!current || !next || !confirm) {
    return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
  }
  if (next !== confirm) {
    return NextResponse.json({ error: "Новые пароли не совпадают" }, { status: 400 });
  }
  if (next.length < MIN_LEN) {
    return NextResponse.json(
      { error: `Минимальная длина пароля — ${MIN_LEN} символов` },
      { status: 400 }
    );
  }
  if (next === current) {
    return NextResponse.json(
      { error: "Новый пароль должен отличаться от текущего" },
      { status: 400 }
    );
  }

  const user = verifyCredentials(session.login, current);
  if (!user) {
    return NextResponse.json({ error: "Текущий пароль неверный" }, { status: 401 });
  }

  updatePassword(user.id, next);
  return NextResponse.json({ ok: true });
}
