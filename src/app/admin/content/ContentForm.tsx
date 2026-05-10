"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Field = { key: string; label: string; textarea?: boolean; upload?: boolean };
type Group = { title: string; fields: Field[] };

export default function ContentForm({
  groups,
  initial,
}: {
  groups: Group[];
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({ ...initial });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function set(key: string, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function uploadFor(key: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    if (!r.ok) {
      setMsg("Ошибка загрузки изображения");
      return;
    }
    const data = await r.json();
    set(key, data.url);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const r = await fetch("/api/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!r.ok) {
      setMsg("Не удалось сохранить");
      return;
    }
    setMsg("Сохранено");
    router.refresh();
    setTimeout(() => setMsg(null), 2000);
  }

  return (
    <div className="mt-8 space-y-8">
      {groups.map((g) => (
        <section key={g.title} className="rounded-2xl border border-text/5 bg-bg-card p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-accent">
            {g.title}
          </h2>
          <div className="mt-4 grid gap-4">
            {g.fields.map((f) => (
              <label key={f.key} className="block text-xs uppercase tracking-wider text-text-muted">
                {f.label}
                {f.textarea ? (
                  <textarea
                    rows={3}
                    value={values[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="mt-2 w-full rounded-lg border border-text/10 bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
                  />
                ) : (
                  <input
                    value={values[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="mt-2 w-full rounded-lg border border-text/10 bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
                  />
                )}
                {f.upload && (
                  <div className="mt-2 flex items-center gap-3">
                    {values[f.key] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={values[f.key]}
                        alt=""
                        className="h-16 w-16 rounded-lg border border-text/10 object-cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadFor(f.key, file);
                      }}
                      className="text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1 file:text-xs file:text-bg"
                    />
                    {values[f.key] && (
                      <button
                        type="button"
                        onClick={() => set(f.key, "")}
                        className="text-xs text-text-dim hover:text-red-400"
                      >
                        очистить
                      </button>
                    )}
                  </div>
                )}
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent/90 disabled:opacity-50"
        >
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
        {msg && <span className="text-sm text-text-muted">{msg}</span>}
      </div>
    </div>
  );
}
