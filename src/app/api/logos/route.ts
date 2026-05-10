import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { createLogo, listLogos } from "@/lib/content";

export async function GET() {
  return NextResponse.json(listLogos());
}

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !body.image) {
    return NextResponse.json({ error: "image required" }, { status: 400 });
  }
  const id = createLogo({
    name: String(body.name || ""),
    image: String(body.image),
    link: body.link ? String(body.link) : null,
    position: Number(body.position) || 0,
  });
  return NextResponse.json({ id });
}
