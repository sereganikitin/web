"use client";

import { useState } from "react";
import {
  formatRuPhone,
  validateEmail,
  validateName,
  validatePhone,
} from "@/lib/validation";

type Props = {
  source: "contacts" | "popup";
  variant?: "inline" | "popup";
  onSuccess?: () => void;
};

export default function LeadForm({ source, variant = "inline", onSuccess }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);

  const [nameErr, setNameErr] = useState<string | null>(null);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  function onNameBlur() {
    if (!name.trim()) return;
    const r = validateName(name);
    setNameErr(r.ok ? null : r.error ?? null);
  }

  function onPhoneBlur() {
    if (!phone.trim()) return;
    const r = validatePhone(phone);
    setPhoneErr(r.ok ? null : r.error ?? null);
  }

  function onEmailBlur() {
    if (!email.trim()) return;
    const r = validateEmail(email);
    setEmailErr(r.ok ? null : r.error ?? null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const nv = validateName(name);
    if (!nv.ok) {
      setNameErr(nv.error ?? null);
      return;
    }
    setNameErr(null);

    const pv = validatePhone(phone);
    if (!pv.ok) {
      setPhoneErr(pv.error ?? null);
      return;
    }
    setPhoneErr(null);

    const ev = validateEmail(email);
    if (!ev.ok) {
      setEmailErr(ev.error ?? null);
      return;
    }
    setEmailErr(null);

    if (!consent) {
      setErr("Необходимо согласие на обработку персональных данных");
      return;
    }

    setLoading(true);
    const r = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        phone: pv.normalized ?? phone,
        email: ev.normalized ?? email,
        message,
        source,
        company,
      }),
    });
    setLoading(false);
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      const msg = data.error || "Не удалось отправить";
      if (data.field === "phone") setPhoneErr(msg);
      else if (data.field === "email") setEmailErr(msg);
      else if (data.field === "name") setNameErr(msg);
      else setErr(msg);
      return;
    }
    setDone(true);
    setName("");
    setPhone("");
    setEmail("");
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
        <p className="mt-2 text-base text-text-muted">
          Заявка отправлена — отвечу в течение дня.
        </p>
      </div>
    );
  }

  const inputCls = (hasErr: boolean) =>
    `mt-2 w-full rounded-lg border bg-bg px-4 py-3 text-base text-text outline-none transition ${
      hasErr ? "border-red-400/60 focus:border-red-400" : "border-text/10 focus:border-accent"
    }`;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {/* honeypot */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          height: 0,
          width: 0,
          overflow: "hidden",
        }}
      >
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
          onChange={(e) => {
            setName(e.target.value);
            if (nameErr) setNameErr(null);
          }}
          onBlur={onNameBlur}
          maxLength={100}
          autoComplete="name"
          className={inputCls(!!nameErr)}
        />
        {nameErr && (
          <span className="mt-1 block text-xs text-red-400 normal-case tracking-normal">
            {nameErr}
          </span>
        )}
      </label>

      <label className="block text-xs uppercase tracking-wider text-text-muted">
        Телефон
        <input
          value={phone}
          onChange={(e) => {
            setPhone(formatRuPhone(e.target.value));
            if (phoneErr) setPhoneErr(null);
          }}
          onBlur={onPhoneBlur}
          maxLength={20}
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
          className={inputCls(!!phoneErr)}
        />
        {phoneErr && (
          <span className="mt-1 block text-xs text-red-400 normal-case tracking-normal">
            {phoneErr}
          </span>
        )}
      </label>

      <label className="block text-xs uppercase tracking-wider text-text-muted">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailErr) setEmailErr(null);
          }}
          onBlur={onEmailBlur}
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          placeholder="name@example.com"
          className={inputCls(!!emailErr)}
        />
        {emailErr && (
          <span className="mt-1 block text-xs text-red-400 normal-case tracking-normal">
            {emailErr}
          </span>
        )}
      </label>

      <label className="block text-xs uppercase tracking-wider text-text-muted">
        Сообщение
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={variant === "popup" ? 3 : 4}
          maxLength={2000}
          className={inputCls(false)}
        />
      </label>

      <label className="flex items-start gap-2 text-xs text-text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 cursor-pointer accent-accent"
          required
        />
        <span>
          Я согласен на обработку персональных данных в соответствии с{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent hover:underline"
          >
            Политикой конфиденциальности
          </a>
          .
        </span>
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
