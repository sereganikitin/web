import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { deleteLead, markLeadRead } from "@/lib/leads";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  if (typeof body.is_read !== "boolean") {
    return NextResponse.json({ error: "is_read required" }, { status: 400 });
  }
  markLeadRead(id, body.is_read);
  return NextResponse.json({ ok: true });
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
  deleteLead(id);
  return NextResponse.json({ ok: true });
}
