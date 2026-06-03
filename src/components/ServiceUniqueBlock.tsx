// Уникальная секция, своя для каждой услуги — чтобы Яндекс не считал
// страницы шаблонным дублем. Контент специфичный, без копи-паста.

type Props = { slug: string };

export default function ServiceUniqueBlock({ slug }: Props) {
  switch (slug) {
    case "lending":
      return <LendingBlock />;
    case "internet-magazin":
      return <ShopBlock />;
    case "telegram-bot":
      return <BotBlock />;
    case "integraciya-crm":
      return <CrmBlock />;
    default:
      return null;
  }
}

/* ────────────────────────────────────────────────── ЛЕНДИНГИ */

const LANDING_TYPES = [
  {
    name: "Продуктовый",
    text:
      "Оффер на первом экране, фичи, социальные доказательства, тарифы, FAQ, форма. Цель — продать продукт или услугу.",
  },
  {
    name: "Событийный",
    text:
      "Таймер до старта, программа, спикеры, регистрация. Используется для конференций, вебинаров и запусков.",
  },
  {
    name: "Под рекламу",
    text:
      "Максимально короткий, 1–2 блока. Заточен под РСЯ, Google Ads и таргет. Главная метрика — стоимость заявки.",
  },
  {
    name: "Личный бренд",
    text:
      "Фото, история, услуги, отзывы, контакты. Для экспертов, фотографов, тренеров, врачей, юристов.",
  },
];

function LendingBlock() {
  return (
    <section className="container-site py-14">
      <h2 className="font-serif text-3xl md:text-4xl">
        Какие лендинги <span className="italic text-accent">делаю</span>
      </h2>
      <p className="mt-4 max-w-2xl text-base text-text-muted">
        Подбираю структуру под цель, а не наоборот. Один шаблон не подходит ко
        всем случаям.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {LANDING_TYPES.map((t) => (
          <div
            key={t.name}
            className="rounded-2xl border border-text/5 bg-bg-card p-6"
          >
            <h3 className="text-lg font-medium">{t.name}</h3>
            <p className="mt-2 text-base leading-relaxed text-text-muted">
              {t.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-accent/30 bg-bg-card p-6">
        <h3 className="text-lg font-medium text-accent">Чего я не делаю</h3>
        <ul className="mt-3 space-y-2 text-base text-text-muted">
          <li>— Не верстаю на Тильде и Wix — они подходят, но не для серьёзных проектов.</li>
          <li>— Не беру задачи «сделать как у конкурента, но другого цвета» — без своего смысла лендинг не работает.</li>
          <li>— Не делаю лендинги в одну ночь за 5 000 ₽ — это не про меня, ищите фрилансера-новичка.</li>
        </ul>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────── ИНТЕРНЕТ-МАГАЗИН */

const SHOP_COLUMNS = [
  {
    title: "Платежи",
    items: ["ЮKassa", "CloudPayments", "Тинькофф Касса", "Робокасса", "Сбер Pay", "СБП", "Stripe (международные)"],
  },
  {
    title: "Доставка",
    items: ["СДЭК", "Boxberry", "Почта России", "DPD", "ПЭК", "Яндекс.Доставка", "Самовывоз с картой ПВЗ"],
  },
  {
    title: "1С и CRM",
    items: ["Обмен товарами CommerceML 2", "Синхронизация остатков и цен", "Заказы в 1С автоматически", "amoCRM", "Битрикс24", "RetailCRM", "Mindbox"],
  },
];

function ShopBlock() {
  return (
    <section className="container-site py-14">
      <h2 className="font-serif text-3xl md:text-4xl">
        Платежи, доставка, <span className="italic text-accent">1С</span>
      </h2>
      <p className="mt-4 max-w-2xl text-base text-text-muted">
        Из коробки подключаю все популярные сервисы. Если нужного нет в списке —
        интегрирую через REST API или вебхуки.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {SHOP_COLUMNS.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-text/5 bg-bg-card p-6"
          >
            <h3 className="text-xs uppercase tracking-wider text-accent">
              {c.title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              {c.items.map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 text-accent">✓</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-text/5 bg-bg-card p-6 md:p-8">
        <h3 className="font-serif text-2xl">
          На чём делать: <span className="italic text-accent">Next.js или WordPress?</span>
        </h3>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-base font-medium">Next.js + Node.js — для роста</div>
            <p className="mt-2 text-sm text-text-muted">
              Если планируете десятки тысяч SKU, B2B-ценообразование, программу лояльности
              или мобильное приложение. Гибче, быстрее на больших каталогах. От 200 000 ₽.
            </p>
          </div>
          <div>
            <div className="text-base font-medium">WordPress + WooCommerce — для старта</div>
            <p className="mt-2 text-sm text-text-muted">
              Если магазин типовой, до 1 000 SKU, и нужна привычная админка для контент-менеджера.
              Дешевле и быстрее запустить. От 120 000 ₽.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────── TELEGRAM-БОТЫ */

const BOT_SCENARIOS = [
  {
    name: "Заявки и уведомления",
    text:
      "Принимает форму с сайта или прямо в чате, шлёт менеджеру в Telegram-группу. Защита от спама, логи в админке.",
    techHint: "node + grammY · 1 неделя · от 20 000 ₽",
  },
  {
    name: "Продажи с оплатой",
    text:
      "Воронка: каталог → товар → корзина → доставка → ЮKassa в чате → подтверждение. Кнопки и inline-меню.",
    techHint: "node/python + ЮKassa · 3–4 недели · от 80 000 ₽",
  },
  {
    name: "FAQ и поддержка",
    text:
      "Отвечает по сценарию, передаёт сложные вопросы оператору. Тикеты, шаблоны ответов, статусы.",
    techHint: "python + aiogram · 2 недели · от 50 000 ₽",
  },
  {
    name: "Внутренний бот команды",
    text:
      "Отчёты, тайм-трекинг, отпуска, согласования. Интеграция с Google Sheets, Notion, 1С:Зарплата.",
    techHint: "node + REST/webhooks · 2–3 недели · от 60 000 ₽",
  },
];

function BotBlock() {
  return (
    <section className="container-site py-14">
      <h2 className="font-serif text-3xl md:text-4xl">
        Сценарии <span className="italic text-accent">ботов</span>
      </h2>
      <p className="mt-4 max-w-2xl text-base text-text-muted">
        Под каждый сценарий — своя архитектура. Иногда хватает простого
        ответчика, иногда нужна воронка с состояниями и базой.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {BOT_SCENARIOS.map((s) => (
          <div
            key={s.name}
            className="rounded-2xl border border-text/5 bg-bg-card p-6"
          >
            <h3 className="text-lg font-medium">{s.name}</h3>
            <p className="mt-2 text-base leading-relaxed text-text-muted">
              {s.text}
            </p>
            <div className="mt-4 inline-block rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-wider text-accent">
              {s.techHint}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-text/5 bg-bg-card p-6">
        <h3 className="text-base font-medium">На чём пишу</h3>
        <p className="mt-2 text-sm text-text-muted">
          <strong className="text-text">Node.js + grammY</strong> — основной стек,
          если проект уже на Node, нужна типизация TypeScript и хорошая
          интеграция с фронтом.{" "}
          <strong className="text-text">Python + aiogram</strong> — если на
          бэкенде Python, нужны ML-фичи (классификация запросов, embeddings) или
          интеграция с pandas/числами.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────── ИНТЕГРАЦИЯ CRM */

const CRM_LIST = [
  { name: "amoCRM", api: "REST + Webhook", note: "Сделки, контакты, источники, UTM, кастомные поля" },
  { name: "Битрикс24", api: "REST + Webhook", note: "Лиды, сделки, открытые линии, чат-боты" },
  { name: "RetailCRM", api: "REST", note: "Для e-commerce: заказы, клиенты, остатки" },
  { name: "Kommo (ex-amoCRM)", api: "REST + Webhook", note: "Аналог amoCRM, тот же API" },
  { name: "Pipedrive", api: "REST", note: "B2B-продажи, deals, activities" },
  { name: "HubSpot", api: "REST", note: "Маркетинг + продажи + сервис" },
  { name: "Salesforce", api: "REST + Streaming", note: "Энтерпрайз-уровень, для крупных проектов" },
  { name: "1С:CRM", api: "REST через 1С Bus", note: "Через стандартный обмен 1С" },
];

function CrmBlock() {
  return (
    <section className="container-site py-14">
      <h2 className="font-serif text-3xl md:text-4xl">
        Подключаю <span className="italic text-accent">любую CRM</span> с API
      </h2>
      <p className="mt-4 max-w-2xl text-base text-text-muted">
        Не привязан к одной системе. Беру ту, в которой работает ваша команда —
        и научу её разговаривать с сайтом.
      </p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-text/5">
        <table className="w-full text-left">
          <thead className="bg-bg-elevated text-xs uppercase tracking-wider text-text-dim">
            <tr>
              <th className="px-5 py-3">CRM</th>
              <th className="hidden px-5 py-3 md:table-cell">Способ</th>
              <th className="px-5 py-3">Что подключаю</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-text/5 bg-bg-card text-sm">
            {CRM_LIST.map((c) => (
              <tr key={c.name}>
                <td className="px-5 py-3 font-medium text-text">{c.name}</td>
                <td className="hidden px-5 py-3 text-accent md:table-cell">{c.api}</td>
                <td className="px-5 py-3 text-text-muted">{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-2xl border border-accent/30 bg-bg-card p-6">
        <h3 className="text-base font-medium">Что обычно передаю в CRM из сайта</h3>
        <ul className="mt-3 grid gap-2 text-sm text-text-muted md:grid-cols-2">
          <li>— Имя, контакт (email/телефон/Telegram)</li>
          <li>— Текст сообщения, источник формы (главная / попап / лендинг)</li>
          <li>— UTM-метки (source, medium, campaign, content, term)</li>
          <li>— Реферер и страница входа</li>
          <li>— ClientID Яндекс.Метрики и Google Analytics</li>
          <li>— Геолокация по IP (при необходимости)</li>
          <li>— Привязка к ответственному менеджеру (round-robin / по правилам)</li>
          <li>— Дубликат-чек по контакту за 7 дней</li>
        </ul>
      </div>
    </section>
  );
}
