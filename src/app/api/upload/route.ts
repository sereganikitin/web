import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";
import { readSession } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "файл слишком большой (макс 8 МБ)" }, { status: 400 });
  }
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "поддерживаются jpg, png, webp, svg" }, { status: 400 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);

  let filename: string;
  if (file.type === "image/svg+xml") {
    filename = `${ts}-${rand}.svg`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buf);
  } else {
    filename = `${ts}-${rand}.webp`;
    await sharp(buf)
      .rotate()
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(UPLOAD_DIR, filename));
  }
  return NextResponse.json({ url: `/uploads/${filename}`, filename });
}
