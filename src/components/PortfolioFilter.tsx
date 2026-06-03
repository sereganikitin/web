"use client";

import { useMemo, useState } from "react";
import type { PortfolioItem } from "@/lib/db";
import WorkCard from "./WorkCard";

const ALL = "Все";

export default function PortfolioFilter({ items }: { items: PortfolioItem[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of items) if (p.category) set.add(p.category);
    return [ALL, ...Array.from(set)];
  }, [items]);

  const [active, setActive] = useState<string>(ALL);

  const visible = active === ALL ? items : items.filter((p) => p.category === active);

  return (
    <>
      {categories.length > 2 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => {
            const count =
              c === ALL ? items.length : items.filter((p) => p.category === c).length;
            const isActive = c === active;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={
                  "rounded-full px-4 py-2 text-sm transition " +
                  (isActive
                    ? "bg-accent text-bg"
                    : "border border-text/15 text-text-muted hover:border-accent hover:text-accent")
                }
              >
                {c} <span className="opacity-60">· {count}</span>
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-12 text-text-muted">В этой категории пока пусто.</p>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {visible.map((p) => (
            <WorkCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </>
  );
}
