import Link from "next/link";
import { listPortfolio } from "@/lib/content";
import { countUnreadLeads } from "@/lib/leads";
import { listServices } from "@/lib/services";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const portfolio = listPortfolio();
  const services = listServices();
  const unread = countUnreadLeads();
  const cards = [
    {
      href: "/admin/leads",
      title: unread > 0 ? `Заявки (${unread} новых)` : "Заявки",
      desc: "Сообщения из контактной формы и попапа.",
    },
    {
      href: "/admin/content",
      title: "Тексты сайта",
      desc: "Hero, услуги на главной, разделы Обо мне и Контакты.",
    },
    {
      href: "/admin/services",
      title: `Услуги (${services.length})`,
      desc: "Страницы раздела /uslugi: тексты, цены, FAQ, кейсы.",
    },
    {
      href: "/admin/portfolio",
      title: `Портфолио (${portfolio.length})`,
      desc: "Добавлять, редактировать и удалять кейсы.",
    },
    {
      href: "/admin/logos",
      title: "Логотипы клиентов",
      desc: "Лента логотипов под hero-блоком.",
    },
    {
      href: "/admin/contacts",
      title: "Контакты",
      desc: "Email, телефон, мессенджеры, соцсети.",
    },
  ];
  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-4xl">
        <span className="italic text-accent">Админка</span>
      </h1>
      <p className="mt-2 text-text-muted">
        Управление контентом сайта web.cd-agency.ru.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-text/5 bg-bg-card p-6 transition hover:border-accent/40 hover:bg-bg-elevated"
          >
            <div className="text-lg font-medium">{c.title}</div>
            <div className="mt-2 text-sm text-text-muted">{c.desc}</div>
            <div className="mt-4 text-xs uppercase tracking-wider text-text-dim transition group-hover:text-accent">
              Открыть →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/"
          target="_blank"
          className="text-sm text-text-muted hover:text-accent"
        >
          ↗ Посмотреть сайт
        </Link>
      </div>
    </div>
  );
}
