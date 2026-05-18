import "server-only";
import type { Lead } from "./db";

type TelegramConfig = {
  token: string;
  chatId: string;
};

function readTelegramConfig(): TelegramConfig | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return null;
  return { token, chatId };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendLeadTelegram(lead: Lead): Promise<void> {
  const cfg = readTelegramConfig();
  if (!cfg) {
    console.warn("[telegram] not configured — skipping notification");
    return;
  }

  const sourceLabel = lead.source === "popup" ? "Попап" : "Контактная форма";
  const text =
    `<b>Новая заявка — ${escapeHtml(sourceLabel)}</b>\n\n` +
    `<b>Имя:</b> ${escapeHtml(lead.name)}\n` +
    `<b>Контакт:</b> ${escapeHtml(lead.contact)}\n` +
    (lead.message
      ? `<b>Сообщение:</b>\n${escapeHtml(lead.message)}\n\n`
      : "\n") +
    `<i>${escapeHtml(lead.created_at)}</i>`;

  const url = `https://api.telegram.org/bot${cfg.token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: cfg.chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`telegram ${res.status}: ${body.slice(0, 200)}`);
  }
}
