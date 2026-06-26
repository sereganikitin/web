import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL ?? "https://cd-agency.ru";

  // Обычные правила + явное разрешение AI-ботам (для GEO - попадания
  // в рекомендации ChatGPT, Claude, Perplexity, Gemini, Я.GPT).
  const adminDisallow = ["/admin", "/api", "/stars"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: adminDisallow },

      // Классические SEO-роботы - стандарт
      { userAgent: "Yandex", allow: "/", disallow: adminDisallow },
      { userAgent: "Googlebot", allow: "/", disallow: adminDisallow },
      { userAgent: "Bingbot", allow: "/", disallow: adminDisallow },

      // AI / LLM-краулеры - явное разрешение, чтобы попадать в их источники
      { userAgent: "GPTBot", allow: "/", disallow: adminDisallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: adminDisallow },
      { userAgent: "ChatGPT-User", allow: "/", disallow: adminDisallow },
      { userAgent: "anthropic-ai", allow: "/", disallow: adminDisallow },
      { userAgent: "ClaudeBot", allow: "/", disallow: adminDisallow },
      { userAgent: "Claude-Web", allow: "/", disallow: adminDisallow },
      { userAgent: "PerplexityBot", allow: "/", disallow: adminDisallow },
      { userAgent: "Google-Extended", allow: "/", disallow: adminDisallow },
      { userAgent: "Applebot-Extended", allow: "/", disallow: adminDisallow },
      { userAgent: "Bytespider", allow: "/", disallow: adminDisallow },
      { userAgent: "YandexAdditional", allow: "/", disallow: adminDisallow },
      { userAgent: "Meta-ExternalAgent", allow: "/", disallow: adminDisallow },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
