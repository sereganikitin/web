"use client";

import { useState } from "react";

type Props = {
  source: "contacts" | "popup";
  variant?: "inline" | "popup";
  onSuccess?: () => void;
};

export default function LeadForm({ source, variant = "inline", onSuccess }: Props) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const r = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, contact, message, source, company }),
    });
    setLoading(false);
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setErr(data.error || "Не удалось отправить");
      return;
    }
    setDone(true);
    setName("");
    setContact("");
    setMessage("");
    onSuccess?.();
  }

  if (done) {
    return (
      <div
        className={
          variant === "popup"
            ? "text-center"
            : "rounded-2xl border border-accent/40 bg-bg-card p-6 text-center"
        }
      >
        <div className="font-serif text-2xl text-accent">Спасибо!</div>
        <p className="mt-2 text-sm text-text-muted">
          Заявка отправлена — отвечу в течение дня.
        </p>
      </div>
    );
  }

  const inputCls =
    "mt-2 w-full rounded-lg border border-text/10 bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* honeypot — visually hidden, ignored by humans */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", height: 0, width: 0, overflow: "hidden" }}>
        <label>
          Company
          <input
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      <label className="block text-xs uppercase tracking-wider text-text-muted">
        Имя
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          className={inputCls}
        />
      </label>

      <label className="block text-xs uppercase tracking-wider text-text-muted">
        Контакт
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          maxLength={200}
          placeholder="Email, телефон или Telegram"
          className={inputCls}
        />
      </label>

      <label className="block text-xs uppercase tracking-wider text-text-muted">
        Сообщение
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={variant === "popup" ? 3 : 4}
          maxLength={2000}
          className={inputCls}
        />
      </label>

      {err && <div className="text-sm text-red-400">{err}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg transition hover:bg-accent/90 disabled:opacity-50"
      >
        {loading ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}
