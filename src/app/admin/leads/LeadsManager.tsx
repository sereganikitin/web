"use client";

import { useState } from "react";
import type { Lead } from "@/lib/db";

type Filter = "all" | "unread" | "contacts" | "popup";

export default function LeadsManager({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState<number | null>(null);

  const filtered = leads.filter((l) => {
    if (filter === "unread") return l.is_read === 0;
    if (filter === "contacts") return l.source === "contacts";
    if (filter === "popup") return l.source === "popup";
    return true;
  });

  async function toggleRead(lead: Lead) {
    setBusy(lead.id);
    const newVal = lead.is_read ? false : true;
    const r = await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ is_read: newVal }),
    });
    setBusy(null);
    if (!r.ok) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, is_read: newVal ? 1 : 0 } : l))
    );
  }

  async function remove(lead: Lead) {
    if (!confirm(`Удалить заявку от ${lead.name || "?"}?`)) return;
    setBusy(lead.id);
    const r = await fetch(`/api/leads/${lead.id}`, { method: "DELETE" });
    setBusy(null);
    if (!r.ok) return;
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
  }

  const unreadCount = leads.filter((l) => l.is_read === 0).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
          Все ({leads.length})
        </FilterBtn>
        <FilterBtn active={filter === "unread"} onClick={() => setFilter("unread")}>
          Непрочитанные ({unreadCount})
        </FilterBtn>
        <FilterBtn active={filter === "contacts"} onClick={() => setFilter("contacts")}>
          Форма
        </FilterBtn>
        <FilterBtn active={filter === "popup"} onClick={() => setFilter("popup")}>
          Попап
        </FilterBtn>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-text/5 bg-bg-card p-8 text-center text-text-muted">
          Заявок пока нет.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((l) => (
            <li
              key={l.id}
              className={`rounded-2xl border bg-bg-card p-5 ${
                l.is_read ? "border-text/5" : "border-accent/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-text-dim">
                    <span>{formatDate(l.created_at)}</span>
                    <span className="rounded-full border border-text/10 px-2 py-0.5">
                      {l.source === "popup" ? "Попап" : "Форма"}
                    </span>
                    {!l.is_read && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">
                        Новая
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-lg text-text">{l.name || "(без имени)"}</div>
                  <div className="mt-1 text-sm text-text-muted">{l.contact}</div>
                  {l.message && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-text">{l.message}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    disabled={busy === l.id}
                    onClick={() => toggleRead(l)}
                    className="rounded-full border border-text/10 px-3 py-1.5 text-xs text-text-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
                  >
                    {l.is_read ? "Непрочитано" : "Прочитано"}
                  </button>
                  <button
                    type="button"
                    disabled={busy === l.id}
                    onClick={() => remove(l)}
                    className="rounded-full border border-red-400/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-400/10 disabled:opacity-50"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 transition ${
        active
          ? "border-accent text-accent"
          : "border-text/10 text-text-muted hover:border-text/30 hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
