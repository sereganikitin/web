import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { deleteLogo } from "@/lib/content";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  deleteLogo(id);
  return NextResponse.json({ ok: true });
}
