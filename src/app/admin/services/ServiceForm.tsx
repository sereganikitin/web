"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Include = { title: string; text: string };
type Faq = { q: string; a: string };

export type ServiceFormData = {
  slug: string;
  position: number;
  metaTitle: string;
  metaDescription: string;
  cardTitle: string;
  cardSummary: string;
  cardKeywords: string[];
  eyebrow: string;
  h1: string;
  intro: string;
  includes: Include[];
  pricing: { priceFrom: string; deadline: string; note?: string };
  faq: Faq[];
  caseSlugs: string[];
};

type Props = {
  initial: ServiceFormData;
  /** Если задан - редактирование существующей записи. Иначе создание новой. */
  originalSlug?: string;
};

export default function ServiceForm({ initial, originalSlug }: Props) {
  const router = useRouter();
  const isEdit = typeof originalSlug === "string";
  const [v, setV] = useState<ServiceFormData>({ ...initial });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof ServiceFormData>(k: K, val: ServiceFormData[K]) {
    setV((s) => ({ ...s, [k]: val }));
  }

  function setPricing<K extends keyof ServiceFormData["pricing"]>(
    k: K,
    val: ServiceFormData["pricing"][K]
  ) {
    setV((s) => ({ ...s, pricing: { ...s.pricing, [k]: val } }));
  }

  function setIncludeAt(i: number, patch: Partial<Include>) {
    setV((s) => ({
      ...s,
      includes: s.includes.map((it, j) => (j === i ? { ...it, ...patch } : it)),
    }));
  }
  function addInclude() {
    setV((s) => ({ ...s, includes: [...s.includes, { title: "", text: "" }] }));
  }
  function removeInclude(i: number) {
    setV((s) => ({ ...s, includes: s.includes.filter((_, j) => j !== i) }));
  }
  function moveInclude(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= v.includes.length) return;
    const next = [...v.includes];
    [next[i], next[j]] = [next[j], next[i]];
    set("includes", next);
  }

  function setFaqAt(i: number, patch: Partial<Faq>) {
    setV((s) => ({
      ...s,
      faq: s.faq.map((it, j) => (j === i ? { ...it, ...patch } : it)),
    }));
  }
  function addFaq() {
    setV((s) => ({ ...s, faq: [...s.faq, { q: "", a: "" }] }));
  }
  function removeFaq(i: number) {
    setV((s) => ({ ...s, faq: s.faq.filter((_, j) => j !== i) }));
  }
  function moveFaq(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= v.faq.length) return;
    const next = [...v.faq];
    [next[i], next[j]] = [next[j], next[i]];
    set("faq", next);
  }

  async function save() {
    setErr(null);
    setBusy(true);
    const r = await fetch(isEdit ? `/api/services/${originalSlug}` : "/api/services", {
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
    router.push("/admin/services");
    router.refresh();
  }

  async function remove() {
    if (!isEdit) return;
    if (!confirm(`Удалить услугу «${v.cardTitle || v.slug}»? URL /uslugi/${v.slug} перестанет открываться.`)) return;
    setBusy(true);
    const r = await fetch(`/api/services/${originalSlug}`, { method: "DELETE" });
    setBusy(false);
    if (!r.ok) {
      setErr("Не удалось удалить");
      return;
    }
    router.push("/admin/services");
    router.refresh();
  }

  return (
    <div className="mt-8 space-y-6">
      <Section title="Основное">
        <Field label="Slug (URL-идентификатор, латиница)">
          <input
            value={v.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="lending"
            className="input"
          />
          {v.slug && (
            <div className="mt-2 text-xs text-text-dim">
              Адрес страницы: /uslugi/{v.slug}
            </div>
          )}
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Позиция (сортировка)">
            <input
              type="number"
              value={v.position}
              onChange={(e) => set("position", Number(e.target.value) || 0)}
              className="input"
            />
          </Field>
          <Field label="Eyebrow (надпись над H1)">
            <input
              value={v.eyebrow}
              onChange={(e) => set("eyebrow", e.target.value)}
              placeholder="Услуги"
              className="input"
            />
          </Field>
        </div>
        <Field label="H1 (заголовок страницы услуги)">
          <input
            value={v.h1}
            onChange={(e) => set("h1", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Intro (текст под H1)">
          <textarea
            rows={4}
            value={v.intro}
            onChange={(e) => set("intro", e.target.value)}
            className="input"
          />
        </Field>
      </Section>

      <Section title="Карточка на /uslugi">
        <Field label="Название карточки">
          <input
            value={v.cardTitle}
            onChange={(e) => set("cardTitle", e.target.value)}
            placeholder="Лендинги"
            className="input"
          />
        </Field>
        <Field label="Краткое описание (на карточке)">
          <textarea
            rows={2}
            value={v.cardSummary}
            onChange={(e) => set("cardSummary", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Ключевые слова для карточки (через запятую)">
          <input
            value={v.cardKeywords.join(", ")}
            onChange={(e) =>
              set(
                "cardKeywords",
                e.target.value.split(",").map((x) => x.trim()).filter(Boolean)
              )
            }
            placeholder="лендинг недорого, одностраничный сайт, landing page"
            className="input"
          />
        </Field>
      </Section>

      <Section title="SEO (мета-теги)">
        <Field label="Meta title">
          <input
            value={v.metaTitle}
            onChange={(e) => set("metaTitle", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Meta description">
          <textarea
            rows={3}
            value={v.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
            className="input"
          />
        </Field>
      </Section>

      <Section title="Что входит">
        <div className="space-y-3">
          {v.includes.map((it, i) => (
            <div key={i} className="rounded-xl border border-text/10 bg-bg p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-text-dim">Пункт {i + 1}</div>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => moveInclude(i, -1)}
                    disabled={i === 0}
                    className="rounded border border-text/10 px-2 py-0.5 text-text-muted hover:border-accent hover:text-accent disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveInclude(i, 1)}
                    disabled={i === v.includes.length - 1}
                    className="rounded border border-text/10 px-2 py-0.5 text-text-muted hover:border-accent hover:text-accent disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeInclude(i)}
                    className="rounded border border-red-400/30 px-2 py-0.5 text-red-400 hover:bg-red-400/10"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <input
                value={it.title}
                onChange={(e) => setIncludeAt(i, { title: e.target.value })}
                placeholder="Заголовок"
                className="input mt-3"
              />
              <textarea
                rows={2}
                value={it.text}
                onChange={(e) => setIncludeAt(i, { text: e.target.value })}
                placeholder="Описание пункта"
                className="input mt-2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addInclude}
            className="rounded-full border border-text/15 px-4 py-2 text-xs text-text-muted hover:border-accent hover:text-accent"
          >
            + Добавить пункт
          </button>
        </div>
      </Section>

      <Section title="Стоимость и срок">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Цена (приблизительная)">
            <input
              value={v.pricing.priceFrom}
              onChange={(e) => setPricing("priceFrom", e.target.value)}
              placeholder="от 30 000 ₽"
              className="input"
            />
          </Field>
          <Field label="Срок">
            <input
              value={v.pricing.deadline}
              onChange={(e) => setPricing("deadline", e.target.value)}
              placeholder="от 2 недель"
              className="input"
            />
          </Field>
        </div>
        <Field label="Примечание (опционально)">
          <textarea
            rows={2}
            value={v.pricing.note ?? ""}
            onChange={(e) => setPricing("note", e.target.value || undefined)}
            placeholder="Точная стоимость зависит от объёма и интеграций."
            className="input"
          />
        </Field>
      </Section>

      <Section title="FAQ (для FAQPage schema)">
        <div className="space-y-3">
          {v.faq.map((it, i) => (
            <div key={i} className="rounded-xl border border-text/10 bg-bg p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-text-dim">Вопрос {i + 1}</div>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => moveFaq(i, -1)}
                    disabled={i === 0}
                    className="rounded border border-text/10 px-2 py-0.5 text-text-muted hover:border-accent hover:text-accent disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFaq(i, 1)}
                    disabled={i === v.faq.length - 1}
                    className="rounded border border-text/10 px-2 py-0.5 text-text-muted hover:border-accent hover:text-accent disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFaq(i)}
                    className="rounded border border-red-400/30 px-2 py-0.5 text-red-400 hover:bg-red-400/10"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <input
                value={it.q}
                onChange={(e) => setFaqAt(i, { q: e.target.value })}
                placeholder="Вопрос"
                className="input mt-3"
              />
              <textarea
                rows={3}
                value={it.a}
                onChange={(e) => setFaqAt(i, { a: e.target.value })}
                placeholder="Ответ"
                className="input mt-2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addFaq}
            className="rounded-full border border-text/15 px-4 py-2 text-xs text-text-muted hover:border-accent hover:text-accent"
          >
            + Добавить вопрос
          </button>
        </div>
      </Section>

      <Section title="Связанные кейсы из портфолио">
        <Field label="Slug'и проектов через запятую">
          <input
            value={v.caseSlugs.join(", ")}
            onChange={(e) =>
              set(
                "caseSlugs",
                e.target.value.split(",").map((x) => x.trim()).filter(Boolean)
              )
            }
            placeholder="ann_shestakova, cd-agency"
            className="input"
          />
          <div className="mt-2 text-xs text-text-dim">
            Slug'и из /admin/portfolio. Будут показаны в блоке «Примеры работ» на странице услуги.
          </div>
        </Field>
      </Section>

      {err && <div className="text-sm text-red-400">{err}</div>}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-bg hover:bg-accent/90 disabled:opacity-50"
        >
          {busy ? "Сохраняю..." : isEdit ? "Сохранить" : "Создать"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="rounded-full border border-red-400/30 px-6 py-2.5 text-sm text-red-400 hover:bg-red-400/10 disabled:opacity-50"
          >
            Удалить
          </button>
        )}
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
      <h2 className="font-serif text-xl">
        <span className="text-accent">{title}</span>
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
