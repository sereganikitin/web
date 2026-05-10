import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { getContent, setContent } from "@/lib/content";

export async function GET() {
  return NextResponse.json(getContent());
}

export async function PUT(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const entries: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (typeof k !== "string") continue;
    entries[k] = String(v ?? "");
  }
  setContent(entries);
  return NextResponse.json({ ok: true });
}
