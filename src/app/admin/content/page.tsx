import { getContent } from "@/lib/content";
import ContentForm from "./ContentForm";

export const dynamic = "force-dynamic";

const groups = [
  {
    title: "Сайт и SEO",
    fields: [
      { key: "site.title", label: "Title (вкладка)" },
      { key: "site.description", label: "Meta description", textarea: true },
    ],
  },
  {
    title: "Hero",
    fields: [
      { key: "hero.eyebrow", label: "Надпись над заголовком" },
      { key: "hero.title_line1", label: "Заголовок, строка 1" },
      { key: "hero.title_line2", label: "Заголовок, строка 2 (курсив)" },
      { key: "hero.subtitle", label: "Подзаголовок", textarea: true },
      { key: "hero.cta_label", label: "Кнопка: текст" },
      { key: "hero.cta_href", label: "Кнопка: ссылка" },
      { key: "hero.image", label: "Главное фото (URL или /uploads/...)", upload: true },
    ],
  },
  {
    title: "Услуги",
    fields: [
      { key: "services.eyebrow", label: "Надпись раздела" },
      { key: "services.s1.num", label: "Услуга 1: номер" },
      { key: "services.s1.title", label: "Услуга 1: название" },
      { key: "services.s1.text", label: "Услуга 1: описание", textarea: true },
      { key: "services.s2.num", label: "Услуга 2: номер" },
      { key: "services.s2.title", label: "Услуга 2: название" },
      { key: "services.s2.text", label: "Услуга 2: описание", textarea: true },
      { key: "services.s3.num", label: "Услуга 3: номер" },
      { key: "services.s3.title", label: "Услуга 3: название" },
      { key: "services.s3.text", label: "Услуга 3: описание", textarea: true },
    ],
  },
  {
    title: "Selected Work",
    fields: [
      { key: "work.eyebrow", label: "Заголовок (часть 1)" },
      { key: "work.title", label: "Заголовок (часть 2, курсив)" },
    ],
  },
  {
    title: "Обо мне",
    fields: [
      { key: "about.eyebrow", label: "Надпись раздела" },
      { key: "about.title", label: "Заголовок" },
      { key: "about.text", label: "Текст", textarea: true },
    ],
  },
  {
    title: "Футер",
    fields: [{ key: "footer.copy", label: "Копирайт" }],
  },
];

export default function ContentPage() {
  const c = getContent();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">
        Тексты <span className="italic text-accent">сайта</span>
      </h1>
      <p className="mt-2 text-text-muted">
        Редактирование текстов главной страницы и SEO.
      </p>
      <ContentForm groups={groups} initial={c} />
    </div>
  );
}
