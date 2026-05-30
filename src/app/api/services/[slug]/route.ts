import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { deleteService, getServiceBySlug, updateService } from "@/lib/services";
import { normalize } from "../route";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await params;
  const s = getServiceBySlug(slug);
  if (!s) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ item: s });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug: originalSlug } = await params;
  const existing = getServiceBySlug(originalSlug);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const next = normalize(body as Record<string, unknown>);
  if (!next.slug) {
    return NextResponse.json({ error: "Заполните slug" }, { status: 400 });
  }
  try {
    updateService(originalSlug, next);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ошибка";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "Услуга с таким slug уже существует" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await params;
  deleteService(slug);
  return NextResponse.json({ ok: true });
}
