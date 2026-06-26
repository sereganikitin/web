import "server-only";
import nodemailer from "nodemailer";
import type { Lead } from "./db";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
};

function readSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const portStr = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const to = process.env.LEAD_NOTIFY_TO;
  if (!host || !portStr || !user || !pass || !from || !to) return null;
  const port = Number(portStr);
  if (!Number.isFinite(port) || port <= 0) return null;
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;
  return { host, port, secure, user, pass, from, to };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendLeadNotification(lead: Lead): Promise<void> {
  const cfg = readSmtpConfig();
  if (!cfg) {
    console.warn("[mailer] SMTP not configured - skipping notification");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });

  const sourceLabel = lead.source === "popup" ? "Попап" : "Контактная форма";
  const subject = `Новая заявка с web.cd-agency.ru - ${sourceLabel}`;
  const text = [
    `Источник: ${sourceLabel}`,
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    `Сообщение: ${lead.message || "(пусто)"}`,
    `Время: ${lead.created_at}`,
  ].join("\n");
  const html = `
    <h2>Новая заявка</h2>
    <p><strong>Источник:</strong> ${escapeHtml(sourceLabel)}</p>
    <p><strong>Имя:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Контакт:</strong> ${escapeHtml(lead.contact)}</p>
    <p><strong>Сообщение:</strong><br>${escapeHtml(lead.message || "(пусто)").replace(/\n/g, "<br>")}</p>
    <p style="color:#888;font-size:12px">Время: ${escapeHtml(lead.created_at)}</p>
  `;

  await transporter.sendMail({
    from: cfg.from,
    to: cfg.to,
    subject,
    text,
    html,
  });
}
