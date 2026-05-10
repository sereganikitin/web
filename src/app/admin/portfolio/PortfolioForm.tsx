"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type PortfolioFormItem = {
  id?: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  content: string;
  gallery: string[];
  client: string;
  year: string;
  image: string | null;
  link: string | null;
  position: number;
  is_published: number;
};

export default function PortfolioForm({ initial }: { initial: PortfolioFormItem }) {
  const router = useRouter();
  const isEdit = typeof initial.id === "number";
  const [v, setV] = useState<PortfolioFormItem>({ ...initial });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof PortfolioFormItem>(k: K, val: PortfolioFormItem[K]) {
    setV((s) => ({ ...s, [k]: val }));
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    if (!r.ok) {
      setErr("Ошибка загрузки изображения");
      return null;
    }
    const data = await r.json();
    return data.url as string;
  }

  async function uploadCover(file: File) {
    const url = await uploadFile(file);
    if (url) set("image", url);
  }

  async function addToGallery(files: FileList) {
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const url = await uploadFile(f);
      if (url) urls.push(url);
    }
    if (urls.length) set("gallery", [...v.gallery, ...urls]);
  }

  function removeFromGallery(i: number) {
    set("gallery", v.gallery.filter((_, j) => j !== i));
  }

  function moveGallery(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= v.gallery.length) return;
    const next = [...v.gallery];
    [next[i], next[j]] = [next[j], next[i]];
    set("gallery", next);
  }

  async function save() {
    setErr(null);
    setBusy(true);
    const r = await fetch(isEdit ? `/api/portfolio/${v.id}` : "/api/portfolio", {
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
    router.push("/admin/portfolio");
    router.refresh();
  }

  async function remove() {
    if (!isEdit) return;
    if (!confirm(`Удалить «${v.title}»?`)) return;
    setBusy(true);
    const r = await fetch(`/api/portfolio/${v.id}`, { method: "DELETE" });
    setBusy(false);
    if (!r.ok) {
      setErr("Не удалось удалить");
      return;
    }
    router.push("/admin/portfolio");
    router.refresh();
  }

  return (
    <div className="mt-8 max-w-3xl space-y-6">
      <Section title="Основное">
        <Field label="Название">
          <input
            value={v.title}
            onChange={(e) => set("title", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Slug (URL-идентификатор, латиница)">
          <input
            value={v.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase())}
            placeholder="my-cool-project"
            className="input"
          />
          {v.slug && (
            <div className="mt-2 text-xs text-text-dim">
              Адрес страницы: /portfolio/{v.slug}
            </div>
          )}
        </Field>
        <Field label="Категория">
          <input
            value={v.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Веб-дизайн / Интернет-магазин / Лендинг"
            className="input"
          />
        </Field>
        <Field label="Краткое описание (на карточке)">
          <textarea
            rows={2}
            value={v.description}
            onChange={(e) => set("description", e.target.value)}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Клиент">
            <input
              value={v.client}
              onChange={(e) => set("client", e.target.value)}
              placeholder="Название бренда"
              className="input"
            />
          </Field>
          <Field label="Год">
            <input
              value={v.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="2025"
              className="input"
            />
          </Field>
        </div>

        <Field label="Внешняя ссылка на сайт проекта">
          <input
            value={v.link ?? ""}
            onChange={(e) => set("link", e.target.value)}
            placeholder="https://example.com"
            className="input"
          />
        </Field>
      </Section>

      <Section title="Обложка">
        <Field label="Изображение карточки и шапки детальной страницы">
          <div className="flex items-center gap-3">
            {v.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={v.image}
                alt=""
                className="h-20 w-28 rounded-lg border border-text/10 object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadCover(f);
                e.currentTarget.value = "";
              }}
              className="text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1 file:text-xs file:text-bg"
            />
            {v.image && (
              <button
                type="button"
                onClick={() => set("image", null)}
                className="text-xs text-text-dim hover:text-red-400"
              >
                очистить
              </button>
            )}
          </div>
        </Field>
      </Section>

      <Section title="Детальная страница">
        <Field label="Полное описание (показывается на /portfolio/slug)">
          <textarea
            rows={8}
            value={v.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder="Расскажите про задачу, решение, технологии, результаты..."
            className="input"
          />
        </Field>

        <Field label={`Галерея (${v.gallery.length})`}>
          {v.gallery.length > 0 && (
            <ul className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {v.gallery.map((url, i) => (
                <li
                  key={url + i}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-text/10 bg-bg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex flex-col items-end justify-between bg-bg/0 p-2 opacity-0 transition group-hover:bg-bg/70 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => removeFromGallery(i)}
                      className="rounded-full bg-bg/80 px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
                    >
                      ✕
                    </button>
                    <div className="flex gap-1 self-stretch justify-center">
                      <button
                        type="button"
                        onClick={() => moveGallery(i, -1)}
                        disabled={i === 0}
                        className="rounded-full bg-bg/80 px-2 py-1 text-xs text-text disabled:opacity-30"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moveGallery(i, 1)}
                        disabled={i === v.gallery.length - 1}
                        className="rounded-full bg-bg/80 px-2 py-1 text-xs text-text disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) addToGallery(e.target.files);
              e.currentTarget.value = "";
            }}
            className="text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1 file:text-xs file:text-bg"
          />
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
          disabled={busy}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent/90 disabled:opacity-50"
        >
          {busy ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
        </button>
        <div className="flex items-center gap-4">
          {isEdit && v.slug && (
            <a
              href={`/portfolio/${v.slug}`}
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
          background: #0a0a0a;
          padding: 0.75rem 1rem;
          color: #f4f1ea;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #d4b88a;
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
