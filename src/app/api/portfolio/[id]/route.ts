import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import {
  deletePortfolio,
  getPortfolio,
  slugify,
  updatePortfolio,
} from "@/lib/content";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const existing = getPortfolio(id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const title = String(body.title || "").trim() || existing.title;
  const slug =
    (String(body.slug || "").trim() || slugify(title)) || existing.slug;

  const gallery = Array.isArray(body.gallery)
    ? JSON.stringify(body.gallery.map(String))
    : existing.gallery;
  try {
    updatePortfolio(id, {
      slug,
      title,
      category: String(body.category ?? existing.category),
      description: String(body.description ?? existing.description),
      content: String(body.content ?? existing.content),
      gallery,
      client: String(body.client ?? existing.client),
      year: String(body.year ?? existing.year),
      image: body.image === null ? null : body.image ? String(body.image) : existing.image,
      link: body.link === null ? null : body.link ? String(body.link) : existing.link,
      position: Number(body.position) || 0,
      is_published: body.is_published ? 1 : 0,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ошибка";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "Такой slug уже существует" }, { status: 409 });
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
  deletePortfolio(id);
  return NextResponse.json({ ok: true });
}
