import type { MetadataRoute } from "next";
import { listPortfolio } from "@/lib/content";
import { listServices } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL ?? "https://web.cd-agency.ru";
  const now = new Date();

  const items = listPortfolio({ publishedOnly: true });
  const services = listServices();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/uslugi`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...services.map((s) => ({
      url: `${base}/uslugi/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...items.map((p) => ({
      url: `${base}/portfolio/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/offer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
