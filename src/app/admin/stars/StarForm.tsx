"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type StarFormItem = {
  id?: number;
  slug: string;
  name: string;
  role: string;
  text: string;
  photo: string | null;
  video: string | null;
  video_embed: string | null;
  position: number;
  is_published: number;
};

export default function StarForm({ initial }: { initial: StarFormItem }) {
  const router = useRouter();
  const isEdit = typeof initial.id === "number";
  const [v, setV] = useState<StarFormItem>({ ...initial });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<"photo" | "video" | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof StarFormItem>(k: K, val: StarFormItem[K]) {
    setV((s) => ({ ...s, [k]: val }));
  }

  async function uploadPhoto(file: File) {
    setErr(null);
    setUploading("photo");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(data.error || "Ошибка загрузки фото");
        return;
      }
      set("photo", data.url as string);
    } finally {
      setUploading(null);
    }
  }

  async function uploadVideo(file: File) {
    setErr(null);
    setUploading("video");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload/video", { method: "POST", body: fd });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(data.error || "Ошибка загрузки видео");
        return;
      }
      set("video", data.url as string);
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setErr(null);
    setBusy(true);
    const r = await fetch(isEdit ? `/api/stars/${v.id}` : "/api/stars", {
      method: isEdit ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(v),
    });
    setBusy(false);
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setErr(data.error || "Не удалось сохранить");
      return;
    }
    router.push("/admin/stars");
    router.refresh();
  }

  async function remove() {
    if (!isEdit) return;
    if (!confirm(`Удалить «${v.name}»?`)) return;
    setBusy(true);
    const r = await fetch(`/api/stars/${v.id}`, { method: "DELETE" });
    setBusy(false);
    if (!r.ok) {
      setErr("Не удалось удалить");
      return;
    }
    router.push("/admin/stars");
    router.refresh();
  }

  return (
    <div className="mt-8 max-w-3xl space-y-6">
      <Section title="Основное">
        <Field label="Имя">
          <input
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Алиас (URL-идентификатор, латиница)">
          <input
            value={v.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase())}
            placeholder="erik-davidovich"
            className="input"
          />
          {v.slug && (
            <div className="mt-2 text-xs text-text-dim">
              Адрес страницы: /stars/{v.slug}
            </div>
          )}
        </Field>
        <Field label="Амплуа / роль">
          <input
            value={v.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="Автоблогер / Кинорежиссёр / Инвестор"
            className="input"
          />
        </Field>
        <Field label="Текст (показывается под медиа)">
          <textarea
            rows={8}
            value={v.text}
            onChange={(e) => set("text", e.target.value)}
            placeholder="История звезды, цитата, описание..."
            className="input"
          />
        </Field>
      </Section>

      <Section title="Фото / обложка">
        <Field label="Фото (используется как постер видео и обложка карточки)">
          <div className="flex flex-wrap items-center gap-3">
            {v.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={v.photo}
                alt=""
                className="h-24 w-20 rounded-lg border border-text/10 object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadPhoto(f);
                e.currentTarget.value = "";
              }}
              className="text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1 file:text-xs file:text-bg"
            />
            {uploading === "photo" && (
              <span className="text-xs text-text-dim">загрузка...</span>
            )}
            {v.photo && (
              <button
                type="button"
                onClick={() => set("photo", null)}
                className="text-xs text-text-dim hover:text-red-400"
              >
                очистить
              </button>
            )}
          </div>
        </Field>
      </Section>

      <Section title="Видео">
        <Field label="Видеофайл (mp4 / webm / mov, до 150 МБ)">
          <div className="flex flex-wrap items-center gap-3">
            {v.video && (
              <span className="max-w-[16rem] truncate rounded-lg border border-text/10 bg-bg px-3 py-2 text-xs text-text-muted">
                {v.video.split("/").pop()}
              </span>
            )}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadVideo(f);
                e.currentTarget.value = "";
              }}
              className="text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1 file:text-xs file:text-bg"
            />
            {uploading === "video" && (
              <span className="text-xs text-text-dim">загрузка...</span>
            )}
            {v.video && (
              <button
                type="button"
                onClick={() => set("video", null)}
                className="text-xs text-text-dim hover:text-red-400"
              >
                очистить
              </button>
            )}
          </div>
        </Field>

        <Field label="Или ссылка на видео (YouTube / VK / Rutube)">
          <input
            value={v.video_embed ?? ""}
            onChange={(e) => set("video_embed", e.target.value)}
            placeholder="https://youtu.be/..."
            className="input"
          />
          <div className="mt-2 text-xs text-text-dim">
            Если загружен файл — показывается он. Иначе берётся ссылка, иначе фото.
          </div>
        </Field>
      </Section>

      <Section title="Публикация">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Позиция (меньше — выше)">
            <input
              type="number"
              value={v.position}
              onChange={(e) => set("position", Number(e.target.value) || 0)}
              className="input"
            />
          </Field>
          <Field label="Видимость">
            <select
              value={v.is_published}
              onChange={(e) => set("is_published", Number(e.target.value))}
              className="input"
            >
              <option value={1}>Опубликован</option>
              <option value={0}>Скрыт</option>
            </select>
          </Field>
        </div>
      </Section>

      {err && <div className="text-sm text-red-400">{err}</div>}

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={save}
          disabled={busy || uploading !== null}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent/90 disabled:opacity-50"
        >
          {busy ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
        </button>
        <div className="flex items-center gap-4">
          {isEdit && v.slug && (
            <a
              href={`/stars/${v.slug}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-text-muted hover:text-accent"
            >
              Открыть на сайте ↗
            </a>
          )}
          {isEdit && (
            <button
              onClick={remove}
              disabled={busy}
              className="text-sm text-text-dim hover:text-red-400"
            >
              Удалить
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          margin-top: 0.5rem;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(244, 241, 234, 0.1);
          background: #17171a;
          padding: 0.75rem 1rem;
          color: #ffffff;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #ceb389;
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-text/5 bg-bg-card p-6">
      <h2 className="text-sm font-medium uppercase tracking-wider text-accent">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs uppercase tracking-wider text-text-muted">
      {label}
      {children}
    </label>
  );
}
