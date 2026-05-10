"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(false);
    setLoading(true);
    const r = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ current, next, confirm }),
    });
    setLoading(false);
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setErr(data.error || "Не удалось сменить пароль");
      return;
    }
    setOk(true);
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <label className="block text-xs uppercase tracking-wider text-text-muted">
        Текущий пароль
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-lg border border-text/10 bg-bg px-4 py-3 text-text outline-none focus:border-accent"
        />
      </label>

      <label className="block text-xs uppercase tracking-wider text-text-muted">
        Новый пароль
        <input
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-2 w-full rounded-lg border border-text/10 bg-bg px-4 py-3 text-text outline-none focus:border-accent"
        />
        <span className="mt-1 block text-[11px] normal-case tracking-normal text-text-dim">
          Минимум 8 символов.
        </span>
      </label>

      <label className="block text-xs uppercase tracking-wider text-text-muted">
        Повторите новый пароль
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-2 w-full rounded-lg border border-text/10 bg-bg px-4 py-3 text-text outline-none focus:border-accent"
        />
      </label>

      {err && <div className="text-sm text-red-400">{err}</div>}
      {ok && <div className="text-sm text-accent">Пароль обновлён.</div>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg transition hover:bg-accent/90 disabled:opacity-50"
      >
        {loading ? "Сохраняю..." : "Сменить пароль"}
      </button>
    </form>
  );
}
