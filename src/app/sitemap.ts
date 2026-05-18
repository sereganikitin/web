import type { MetadataRoute } from "next";
import { listPortfolio } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL ?? "https://web.cd-agency.ru";
  const now = new Date();

  const items = listPortfolio({ publishedOnly: true });

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    ...items.map((p) => ({
      url: `${base}/portfolio/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
