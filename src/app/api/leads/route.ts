import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";
import { sendLeadNotification } from "@/lib/mailer";

const MAX_NAME = 100;
const MAX_CONTACT = 200;
const MAX_MESSAGE = 2000;

function clean(s: unknown, max: number): string {
  return String(s ?? "").trim().slice(0, max);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));

  // Honeypot — bots typically fill all fields including hidden ones.
  if (body && typeof body === "object" && "company" in body && String(body.company || "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX_NAME);
  const contact = clean(body.contact, MAX_CONTACT);
  const message = clean(body.message, MAX_MESSAGE);
  const sourceRaw = clean(body.source, 32);
  const source = sourceRaw === "popup" ? "popup" : "contacts";

  if (!name) {
    return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
  }
  if (!contact) {
    return NextResponse.json({ error: "Укажите контакт для связи" }, { status: 400 });
  }

  const lead = createLead({ name, contact, message, source });

  // Email notification — non-blocking to the user response. Errors logged only.
  sendLeadNotification(lead).catch((e) => {
    console.error("[mailer] sendLeadNotification failed:", e);
  });

  return NextResponse.json({ ok: true });
}
