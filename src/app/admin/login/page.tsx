"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    setLoading(false);
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setErr(data.error || "Не удалось войти");
      return;
    }
    router.push(from);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-text/10 bg-bg-card p-8"
      >
        <h1 className="font-serif text-2xl">
          Вход в <span className="italic text-accent">админку</span>
        </h1>
        <p className="mt-2 text-sm text-text-muted">web.cd-agency.ru</p>

        <label className="mt-6 block text-xs uppercase tracking-wider text-text-muted">
          Логин
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
            required
            className="mt-2 w-full rounded-lg border border-text/10 bg-bg px-4 py-3 text-text outline-none focus:border-accent"
          />
        </label>

        <label className="mt-4 block text-xs uppercase tracking-wider text-text-muted">
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-lg border border-text/10 bg-bg px-4 py-3 text-text outline-none focus:border-accent"
          />
        </label>

        {err && <div className="mt-4 text-sm text-red-400">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg transition hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </main>
  );
}
