import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { createPortfolio, listPortfolio, slugify } from "@/lib/content";

export async function GET() {
  return NextResponse.json(listPortfolio());
}

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "Название обязательно" }, { status: 400 });

  const slug = (String(body.slug || "").trim() || slugify(title)) || `item-${Date.now()}`;
  const gallery = Array.isArray(body.gallery)
    ? JSON.stringify(body.gallery.map(String))
    : "[]";
  try {
    const id = createPortfolio({
      slug,
      title,
      category: String(body.category || ""),
      description: String(body.description || ""),
      content: String(body.content || ""),
      gallery,
      client: String(body.client || ""),
      year: String(body.year || ""),
      image: body.image ? String(body.image) : null,
      link: body.link ? String(body.link) : null,
      position: Number(body.position) || 0,
      is_published: body.is_published ? 1 : 0,
    });
    return NextResponse.json({ id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ошибка";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "Такой slug уже существует" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
