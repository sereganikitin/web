import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";
import { readSession } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const targetUrl = String(body?.url || "").trim();
  if (!targetUrl) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }
  try {
    const u = new URL(targetUrl);
    if (!["http:", "https:"].includes(u.protocol)) throw new Error("bad protocol");
  } catch {
    return NextResponse.json({ error: "некорректный URL" }, { status: 400 });
  }

  // Microlink free API - без ключа лимиты ~50 req/day/IP, кешируется ими по URL.
  // waitUntil=networkidle0 + waitFor=4000ms - даём странице догрузить шрифты,
  // картинки и hero-анимации перед снимком.
  const microUrl =
    "https://api.microlink.io?" +
    new URLSearchParams({
      url: targetUrl,
      screenshot: "true",
      meta: "false",
      "viewport.width": "1600",
      "viewport.height": "900",
      "viewport.deviceScaleFactor": "1",
      waitUntil: "networkidle0",
      waitFor: "4000",
      fullPage: "false",
      type: "png",
      timeout: "45000",
    }).toString();

  let metaRes: Response;
  try {
    metaRes = await fetch(microUrl, {
      signal: AbortSignal.timeout(60_000),
      headers: { accept: "application/json" },
    });
  } catch {
    return NextResponse.json(
      { error: "сервис скриншотов не ответил за минуту" },
      { status: 504 }
    );
  }
  if (!metaRes.ok) {
    return NextResponse.json(
      { error: `сервис скриншотов вернул ${metaRes.status}` },
      { status: 502 }
    );
  }
  const meta = (await metaRes.json().catch(() => null)) as
    | { status?: string; data?: { screenshot?: { url?: string } }; message?: string }
    | null;
  const shotUrl = meta?.data?.screenshot?.url;
  if (!shotUrl) {
    return NextResponse.json(
      { error: meta?.message || "не удалось получить скриншот" },
      { status: 502 }
    );
  }

  let imgRes: Response;
  try {
    imgRes = await fetch(shotUrl, { signal: AbortSignal.timeout(30_000) });
  } catch {
    return NextResponse.json({ error: "не удалось скачать скриншот" }, { status: 504 });
  }
  if (!imgRes.ok) {
    return NextResponse.json(
      { error: `скачивание скриншота: ${imgRes.status}` },
      { status: 502 }
    );
  }
  const buf = Buffer.from(await imgRes.arrayBuffer());
  if (buf.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "файл скриншота слишком большой" }, { status: 413 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `shot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
  await sharp(buf)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(UPLOAD_DIR, filename));

  return NextResponse.json({ url: `/uploads/${filename}` });
}
