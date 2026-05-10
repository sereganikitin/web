"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ClientLogo } from "@/lib/db";

export default function LogosManager({ initial }: { initial: ClientLogo[] }) {
  const router = useRouter();
  const [logos, setLogos] = useState(initial);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function add(file: File) {
    setBusy(true);
    setErr(null);
    const fd = new FormData();
    fd.append("file", file);
    const up = await fetch("/api/upload", { method: "POST", body: fd });
    if (!up.ok) {
      setErr("Ошибка загрузки");
      setBusy(false);
      return;
    }
    const { url } = await up.json();
    const r = await fetch("/api/logos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: name || file.name,
        image: url,
        link: link || null,
        position: logos.length,
      }),
    });
    setBusy(false);
    if (!r.ok) {
      setErr("Не удалось сохранить");
      return;
    }
    setName("");
    setLink("");
    router.refresh();
    const list = await (await fetch("/api/logos")).json();
    setLogos(list);
  }

  async function remove(id: number) {
    if (!confirm("Удалить логотип?")) return;
    const r = await fetch(`/api/logos/${id}`, { method: "DELETE" });
    if (r.ok) {
      setLogos((ls) => ls.filter((l) => l.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-2xl border border-text/5 bg-bg-card p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-accent">
          Добавить логотип
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название клиента"
            className="rounded-lg border border-text/10 bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Ссылка (опционально)"
            className="rounded-lg border border-text/10 bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) add(f);
              e.currentTarget.value = "";
            }}
            className="text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1 file:text-xs file:text-bg"
          />
        </div>
        {err && <div className="mt-3 text-sm text-red-400">{err}</div>}
      </section>

      <section className="rounded-2xl border border-text/5 bg-bg-card p-2">
        {logos.length === 0 ? (
          <div className="p-6 text-center text-text-muted">Пока нет логотипов</div>
        ) : (
          <ul className="divide-y divide-text/5">
            {logos.map((l) => (
              <li key={l.id} className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-24 items-center justify-center rounded-lg border border-text/10 bg-bg p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.image} alt={l.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{l.name}</div>
                  {l.link && (
                    <div className="truncate text-xs text-text-muted">{l.link}</div>
                  )}
                </div>
                <button
                  onClick={() => remove(l.id)}
                  className="text-xs text-text-dim hover:text-red-400"
                >
                  удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
