import { getContent } from "@/lib/content";
import ContentForm from "../content/ContentForm";

export const dynamic = "force-dynamic";

const groups = [
  {
    title: "Заголовок раздела",
    fields: [
      { key: "contacts.eyebrow", label: "Надпись над заголовком" },
      { key: "contacts.title", label: "Заголовок (курсив)" },
      { key: "contacts.text", label: "Текст под заголовком", textarea: true },
    ],
  },
  {
    title: "Каналы связи",
    fields: [
      { key: "contacts.email", label: "Email" },
      { key: "contacts.phone", label: "Телефон" },
      { key: "contacts.telegram", label: "Telegram (ссылка вида https://t.me/...)" },
      { key: "contacts.whatsapp", label: "WhatsApp (ссылка вида https://wa.me/...)" },
      { key: "contacts.max", label: "MAX (ссылка вида https://max.ru/+79...)" },
      { key: "contacts.github", label: "GitHub" },
    ],
  },
];

export default function AdminContactsPage() {
  const c = getContent();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">
        <span className="text-accent">Контакты</span>
      </h1>
      <p className="mt-2 text-text-muted">
        Способы связи и социальные сети.
      </p>
      <ContentForm groups={groups} initial={c} />
    </div>
  );
}
