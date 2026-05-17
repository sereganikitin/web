import type { Metadata } from "next";
import "./globals.css";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const c = getContent();
  return {
    title: c["site.title"] ?? "Сергей Никитин — веб-разработка",
    description: c["site.description"] ?? "",
    metadataBase: new URL(process.env.SITE_URL ?? "https://web.cd-agency.ru"),
    openGraph: {
      title: c["site.title"],
      description: c["site.description"],
      type: "website",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500;1,9..144,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg text-text">{children}</body>
    </html>
  );
}
