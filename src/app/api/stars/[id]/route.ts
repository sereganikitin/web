import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { slugify } from "@/lib/content";
import { deleteStar, getStar, updateStar } from "@/lib/stars";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const existing = getStar(id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const name = String(body.name || "").trim() || existing.name;
  const slug = (String(body.slug || "").trim() || slugify(name)) || existing.slug;

  try {
    updateStar(id, {
      slug,
      name,
      role: String(body.role ?? existing.role),
      text: String(body.text ?? existing.text),
      photo: body.photo === null ? null : body.photo ? String(body.photo) : existing.photo,
      video: body.video === null ? null : body.video ? String(body.video) : existing.video,
      // Embed — обычное текстовое поле: что в нём, то и сохраняем (пустое → null).
      video_embed: String(body.video_embed ?? "").trim() || null,
      position: Number(body.position) || 0,
      is_published: body.is_published ? 1 : 0,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ошибка";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "Такой алиас уже существует" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  deleteStar(id);
  return NextResponse.json({ ok: true });
}
