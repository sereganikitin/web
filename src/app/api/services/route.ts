import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { createService, listServices, type Service } from "@/lib/services";

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ items: listServices() });
}

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const s = normalize(body);
  if (!s.slug) {
    return NextResponse.json({ error: "Заполните slug" }, { status: 400 });
  }
  try {
    createService(s);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ошибка";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "Услуга с таким slug уже существует" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export function normalize(input: Record<string, unknown>): Service {
  return {
    slug: String((input.slug as string) ?? "").trim(),
    position: Number(input.position) || 0,
    metaTitle: String((input.metaTitle as string) ?? ""),
    metaDescription: String((input.metaDescription as string) ?? ""),
    cardTitle: String((input.cardTitle as string) ?? ""),
    cardSummary: String((input.cardSummary as string) ?? ""),
    cardKeywords: Array.isArray(input.cardKeywords)
      ? (input.cardKeywords as unknown[]).map(String).map((s) => s.trim()).filter(Boolean)
      : [],
    eyebrow: String((input.eyebrow as string) ?? ""),
    h1: String((input.h1 as string) ?? ""),
    intro: String((input.intro as string) ?? ""),
    includes: Array.isArray(input.includes)
      ? (input.includes as unknown[])
          .map((it) => {
            const o = (it ?? {}) as Record<string, unknown>;
            return { title: String(o.title ?? ""), text: String(o.text ?? "") };
          })
          .filter((it) => it.title || it.text)
      : [],
    pricing: {
      priceFrom: String(((input.pricing as Record<string, unknown>)?.priceFrom as string) ?? ""),
      deadline: String(((input.pricing as Record<string, unknown>)?.deadline as string) ?? ""),
      note: ((): string | undefined => {
        const v = (input.pricing as Record<string, unknown>)?.note;
        const s = v == null ? "" : String(v);
        return s.trim() ? s : undefined;
      })(),
    },
    faq: Array.isArray(input.faq)
      ? (input.faq as unknown[])
          .map((it) => {
            const o = (it ?? {}) as Record<string, unknown>;
            return { q: String(o.q ?? ""), a: String(o.a ?? "") };
          })
          .filter((it) => it.q || it.a)
      : [],
    caseSlugs: Array.isArray(input.caseSlugs)
      ? (input.caseSlugs as unknown[]).map(String).map((s) => s.trim()).filter(Boolean)
      : [],
  };
}
