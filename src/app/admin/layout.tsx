import "../globals.css";
import Link from "next/link";
import { readSession } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/leads", label: "Заявки" },
  { href: "/admin/content", label: "Тексты" },
  { href: "/admin/portfolio", label: "Портфолио" },
  { href: "/admin/logos", label: "Логотипы клиентов" },
  { href: "/admin/contacts", label: "Контакты" },
  { href: "/admin/account", label: "Аккаунт" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();
  // /admin/login renders without sidebar
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg text-text">
        {session ? (
          <div className="flex min-h-screen">
            <aside className="hidden w-60 shrink-0 border-r border-text/5 bg-bg-card md:block">
              <div className="px-6 py-6">
                <Link href="/" className="font-serif text-xl italic text-accent">
                  sn. admin
                </Link>
              </div>
              <nav className="px-3">
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="block rounded-lg px-3 py-2 text-sm text-text-muted transition hover:bg-bg-elevated hover:text-text"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
              <div className="px-6 py-6 text-xs text-text-dim">
                <div>{session.login}</div>
                <form action="/api/auth/logout" method="post" className="mt-2">
                  <button className="text-text-muted hover:text-accent" type="submit">
                    Выйти →
                  </button>
                </form>
              </div>
            </aside>
            <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
