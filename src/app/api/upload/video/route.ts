import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { readSession } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 150 * 1024 * 1024; // 150MB

const EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "файл слишком большой (макс 150 МБ)" },
      { status: 400 }
    );
  }
  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "поддерживаются mp4, webm, mov" },
      { status: 400 }
    );
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const filename = `${ts}-${rand}.${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buf);

  return NextResponse.json({ url: `/uploads/${filename}`, filename });
}
