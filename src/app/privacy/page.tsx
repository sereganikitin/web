import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LEGAL } from "@/lib/legal";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Политика конфиденциальности — ${LEGAL.shortName}`,
  description:
    "Политика обработки персональных данных пользователей сайта web.cd-agency.ru в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const c = getContent();
  const updated = "17 мая 2026 г.";

  return (
    <>
      <Header />
      <main className="pt-32">
        <article className="container-site max-w-3xl pb-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted transition hover:text-accent"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-text/10">
              ←
            </span>
            На главную
          </Link>

          <h1 className="mt-10 font-serif text-4xl leading-tight md:text-5xl">
            Политика обработки <span className="italic text-accent">персональных данных</span>
          </h1>
          <p className="mt-4 text-sm text-text-dim">Редакция от {updated}</p>

          <Section title="1. Общие положения">
            <p>
              Настоящая Политика обработки персональных данных (далее — «Политика») разработана
              в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных
              данных» и определяет порядок обработки персональных данных и меры по обеспечению
              их безопасности, предпринимаемые {LEGAL.entity} (далее — «Оператор»).
            </p>
            <p>
              Оператор ставит своей важнейшей целью и условием осуществления деятельности
              соблюдение прав и свобод человека и гражданина при обработке его персональных
              данных, в том числе защиты прав на неприкосновенность частной жизни.
            </p>
            <p>
              Настоящая Политика применяется ко всей информации, которую Оператор может получить
              о посетителях сайта {LEGAL.site}.
            </p>
          </Section>

          <Section title="2. Сведения об Операторе">
            <ul className="space-y-2">
              <Bullet label="Наименование">{LEGAL.entity}</Bullet>
              <Bullet label="ОГРНИП">{LEGAL.ogrnip}</Bullet>
              <Bullet label="ИНН">{LEGAL.inn}</Bullet>
              <Bullet label="Адрес">г. {LEGAL.city}</Bullet>
              <Bullet label="Телефон">
                <a href={`tel:${LEGAL.phone}`} className="text-accent hover:underline">
                  {LEGAL.phoneDisplay}
                </a>
              </Bullet>
              <Bullet label="Email">
                <a href={`mailto:${LEGAL.email}`} className="text-accent hover:underline">
                  {LEGAL.email}
                </a>
              </Bullet>
            </ul>
          </Section>

          <Section title="3. Основные понятия">
            <p>
              <strong>Персональные данные</strong> — любая информация, относящаяся к прямо или
              косвенно определённому или определяемому физическому лицу (субъекту персональных
              данных).
            </p>
            <p>
              <strong>Обработка персональных данных</strong> — любое действие или совокупность
              действий, совершаемых с использованием средств автоматизации или без таковых, с
              персональными данными, включая сбор, запись, систематизацию, накопление,
              хранение, уточнение, извлечение, использование, передачу, обезличивание,
              блокирование, удаление, уничтожение.
            </p>
            <p>
              <strong>Сайт</strong> — совокупность графических и информационных материалов, а
              также программ для ЭВМ и баз данных, обеспечивающих их доступность в сети
              «Интернет» по адресу {LEGAL.site}.
            </p>
          </Section>

          <Section title="4. Состав обрабатываемых персональных данных">
            <p>Оператор обрабатывает следующие персональные данные пользователей:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>имя (или иное обращение, указанное пользователем);</li>
              <li>контактные данные: телефон, email, ник в мессенджере (Telegram, WhatsApp);</li>
              <li>содержание сообщения, направленного через форму обратной связи;</li>
              <li>IP-адрес, данные cookies, информация о браузере и устройстве;</li>
              <li>данные, передаваемые сервисами веб-аналитики (Яндекс.Метрика).</li>
            </ul>
          </Section>

          <Section title="5. Цели обработки персональных данных">
            <ul className="list-disc space-y-1 pl-6">
              <li>
                ответ на обращения пользователя, направленные через форму обратной связи или
                всплывающую форму;
              </li>
              <li>заключение и исполнение договоров на оказание услуг;</li>
              <li>информирование о статусе обращения и ходе работ по проекту;</li>
              <li>
                аналитика поведения пользователей на сайте в обезличенном виде для улучшения
                его работы.
              </li>
            </ul>
          </Section>

          <Section title="6. Правовые основания обработки">
            <p>
              Оператор обрабатывает персональные данные пользователя только в случае их
              заполнения и/или отправки пользователем самостоятельно через специальные формы.
              Заполняя соответствующие формы и/или отправляя свои персональные данные Оператору,
              пользователь выражает своё согласие с настоящей Политикой и даёт согласие на
              обработку своих персональных данных.
            </p>
            <p>
              Обработка персональных данных осуществляется на основании:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>согласия субъекта персональных данных;</li>
              <li>
                Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»;
              </li>
              <li>иных федеральных законов и нормативно-правовых актов.</li>
            </ul>
          </Section>

          <Section title="7. Порядок и условия обработки">
            <p>
              Обработка персональных данных осуществляется с соблюдением принципов и правил,
              предусмотренных Федеральным законом № 152-ФЗ. Хранение персональных данных
              осуществляется в форме, позволяющей определить субъекта, не дольше, чем этого
              требуют цели их обработки.
            </p>
            <p>
              Персональные данные хранятся на серверах, расположенных на территории Российской
              Федерации. Доступ к данным имеет только Оператор. Передача персональных данных
              третьим лицам не осуществляется, за исключением случаев, прямо предусмотренных
              законодательством РФ.
            </p>
          </Section>

          <Section title="8. Cookies и веб-аналитика">
            <p>
              Сайт использует файлы cookies для корректной работы интерфейса и сервис
              Яндекс.Метрика для сбора обезличенной статистики посещений. Пользователь может
              отключить cookies в настройках своего браузера. Это может повлиять на работу
              отдельных функций сайта.
            </p>
          </Section>

          <Section title="9. Права субъекта персональных данных">
            <p>Пользователь имеет право:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>получить сведения об обработке своих персональных данных;</li>
              <li>требовать уточнения, блокирования или уничтожения данных;</li>
              <li>отозвать согласие на обработку персональных данных;</li>
              <li>
                обжаловать действия Оператора в Роскомнадзоре или в судебном порядке.
              </li>
            </ul>
            <p>
              Для реализации указанных прав пользователь может направить запрос Оператору по
              email{" "}
              <a href={`mailto:${LEGAL.email}`} className="text-accent hover:underline">
                {LEGAL.email}
              </a>
              .
            </p>
          </Section>

          <Section title="10. Заключительные положения">
            <p>
              Оператор имеет право вносить изменения в настоящую Политику. При внесении
              изменений в актуальной редакции указывается дата последнего обновления. Новая
              редакция Политики вступает в силу с момента её размещения на сайте, если иное не
              предусмотрено новой редакцией.
            </p>
            <p>
              Все предложения или вопросы по настоящей Политике следует направлять на email{" "}
              <a href={`mailto:${LEGAL.email}`} className="text-accent hover:underline">
                {LEGAL.email}
              </a>
              .
            </p>
          </Section>
        </article>
      </main>
      <Footer copy={c["footer.copy"] ?? `© ${LEGAL.shortName}`} />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-3 text-base leading-relaxed text-text-muted">
        {children}
      </div>
    </section>
  );
}

function Bullet({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap gap-x-3">
      <span className="text-text-dim">{label}:</span>
      <span className="text-text">{children}</span>
    </li>
  );
}
