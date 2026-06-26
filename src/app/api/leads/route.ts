import { NextResponse } from "next/server";
import dns from "node:dns/promises";
import { createLead } from "@/lib/leads";
import { sendLeadNotification } from "@/lib/mailer";
import { sendLeadTelegram } from "@/lib/telegram";
import { validateEmail, validateName, validatePhone } from "@/lib/validation";

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_PHONE = 30;
const MAX_MESSAGE = 2000;

function clean(s: unknown, max: number): string {
  return String(s ?? "").trim().slice(0, max);
}

async function emailDomainExists(domain: string): Promise<boolean> {
  try {
    const records = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("dns timeout")), 3000)
      ),
    ]);
    return Array.isArray(records) && records.length > 0;
  } catch {
    try {
      const a = await dns.resolve4(domain);
      return Array.isArray(a) && a.length > 0;
    } catch {
      return false;
    }
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));

  // Honeypot
  if (
    body &&
    typeof body === "object" &&
    "company" in body &&
    String(body.company || "").trim() !== ""
  ) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX_NAME);
  const phoneRaw = clean(body.phone, MAX_PHONE);
  const emailRaw = clean(body.email, MAX_EMAIL);
  const message = clean(body.message, MAX_MESSAGE);
  const sourceRaw = clean(body.source, 32);
  const source = sourceRaw === "popup" ? "popup" : "contacts";

  const nv = validateName(name);
  if (!nv.ok) {
    return NextResponse.json(
      { error: nv.error ?? "Укажите имя", field: "name" },
      { status: 400 }
    );
  }

  const pv = validatePhone(phoneRaw);
  if (!pv.ok) {
    return NextResponse.json(
      { error: pv.error ?? "Укажите телефон", field: "phone" },
      { status: 400 }
    );
  }

  const ev = validateEmail(emailRaw);
  if (!ev.ok) {
    return NextResponse.json(
      { error: ev.error ?? "Укажите email", field: "email" },
      { status: 400 }
    );
  }

  // DNS MX-проверка домена email - отлавливает опечатки и фейки.
  if (ev.emailDomain) {
    const exists = await emailDomainExists(ev.emailDomain);
    if (!exists) {
      return NextResponse.json(
        {
          error: `Похоже, домена ${ev.emailDomain} не существует. Проверьте email.`,
          field: "email",
        },
        { status: 400 }
      );
    }
  }

  // Объединяем оба контакта в текстовое поле БД (схему не трогаем).
  const contact = `${ev.normalized} · тел. ${pv.normalized}`;
  const lead = createLead({ name, contact, message, source });

  sendLeadNotification(lead).catch((e) => {
    console.error("[mailer] sendLeadNotification failed:", e);
  });
  sendLeadTelegram(lead).catch((e) => {
    console.error("[telegram] sendLeadTelegram failed:", e);
  });

  return NextResponse.json({ ok: true });
}
