import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { slugify } from "@/lib/content";
import { createStar, listStars } from "@/lib/stars";

export async function GET() {
  return NextResponse.json(listStars());
}

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Имя обязательно" }, { status: 400 });

  const slug = (String(body.slug || "").trim() || slugify(name)) || `star-${Date.now()}`;
  try {
    const id = createStar({
      slug,
      name,
      role: String(body.role || ""),
      text: String(body.text || ""),
      photo: body.photo ? String(body.photo) : null,
      video: body.video ? String(body.video) : null,
      video_embed: body.video_embed ? String(body.video_embed) : null,
      position: Number(body.position) || 0,
      is_published: body.is_published ? 1 : 0,
    });
    return NextResponse.json({ id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ошибка";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "Такой алиас уже существует" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
