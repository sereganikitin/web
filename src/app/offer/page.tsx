import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LEGAL } from "@/lib/legal";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Публичная оферта - ${LEGAL.shortName}`,
  description:
    "Публичная оферта на оказание услуг по разработке сайтов, веб-приложений, Telegram-ботов и интеграций. ИП Никитин Сергей Владимирович.",
  alternates: { canonical: "/offer" },
  robots: { index: true, follow: true },
};

export default function OfferPage() {
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
            Публичная <span className="text-accent">оферта</span>
          </h1>
          <p className="mt-4 text-sm text-text-dim">Редакция от {updated}</p>

          <Section title="1. Общие положения">
            <p>
              Настоящий документ является публичной офертой (далее - «Оферта»)
              {" "}{LEGAL.entity} (далее - «Исполнитель»), адресованной неопределённому кругу
              физических и юридических лиц (далее - «Заказчик»).
            </p>
            <p>
              В соответствии со статьёй 437 Гражданского кодекса Российской Федерации, в
              случае принятия изложенных ниже условий и оплаты услуг, лицо, производящее акцепт
              этой Оферты, становится Заказчиком. Договор считается заключённым с момента
              совершения акцепта.
            </p>
            <p>
              Акцептом Оферты является осуществление Заказчиком действий, направленных на
              получение услуг: направление заявки через сайт {LEGAL.site}, согласование объёма
              работ с Исполнителем, оплата услуг полностью или частично.
            </p>
          </Section>

          <Section title="2. Сведения об Исполнителе">
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

          <Section title="3. Предмет договора">
            <p>
              Исполнитель обязуется по заданию Заказчика оказать услуги по разработке
              цифровых продуктов, а Заказчик обязуется принять и оплатить их. В состав
              услуг могут входить:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>разработка сайтов любой сложности (лендинги, корпоративные сайты, интернет-магазины);</li>
              <li>разработка веб-приложений и личных кабинетов;</li>
              <li>разработка Telegram-ботов;</li>
              <li>интеграция сайта с CRM-системами, платёжными системами и сторонними сервисами;</li>
              <li>миграция сайтов между платформами;</li>
              <li>техническая поддержка и сопровождение;</li>
              <li>иные услуги по предварительному согласованию сторон.</li>
            </ul>
            <p>
              Конкретный перечень работ, сроки и стоимость согласовываются сторонами отдельно
              в письменной форме (счёт, договор, переписка по email или в мессенджере) и
              являются неотъемлемой частью настоящего Договора.
            </p>
          </Section>

          <Section title="4. Стоимость услуг и порядок оплаты">
            <p>
              Стоимость услуг определяется индивидуально для каждого проекта в зависимости от
              объёма и сложности работ. Расчёт стоимости направляется Заказчику до начала
              работ.
            </p>
            <p>
              Оплата производится в рублях Российской Федерации путём безналичного перевода на
              расчётный счёт Исполнителя или иным согласованным способом.
            </p>
            <p>
              Стандартный порядок оплаты: 50% предоплата до начала работ, 50% по факту сдачи
              проекта. Иной порядок может быть установлен по соглашению сторон.
            </p>
          </Section>

          <Section title="5. Сроки оказания услуг">
            <p>
              Сроки выполнения работ согласовываются индивидуально для каждого проекта и
              фиксируются в письменной форме. Исполнитель вправе сдвинуть сроки в случае
              несвоевременного предоставления Заказчиком материалов, необходимых для
              выполнения работ.
            </p>
          </Section>

          <Section title="6. Права и обязанности сторон">
            <p><strong>Исполнитель обязуется:</strong></p>
            <ul className="list-disc space-y-1 pl-6">
              <li>оказывать услуги качественно и в согласованные сроки;</li>
              <li>информировать Заказчика о ходе выполнения работ;</li>
              <li>сохранять конфиденциальность полученной от Заказчика информации.</li>
            </ul>
            <p className="mt-4"><strong>Заказчик обязуется:</strong></p>
            <ul className="list-disc space-y-1 pl-6">
              <li>своевременно предоставлять Исполнителю материалы и информацию, необходимые для выполнения работ;</li>
              <li>оплачивать услуги в согласованном порядке и сроки;</li>
              <li>принимать работы по завершении или мотивированно отказываться от приёмки.</li>
            </ul>
          </Section>

          <Section title="7. Приёмка работ">
            <p>
              По завершении работ Исполнитель направляет Заказчику результат работ (доступ
              к сайту, исходные файлы, демо-ссылка). Заказчик в течение 5 (пяти) рабочих дней
              обязан принять работы или направить мотивированный отказ с перечнем замечаний.
            </p>
            <p>
              В случае отсутствия мотивированного отказа в указанный срок работы считаются
              принятыми в полном объёме.
            </p>
          </Section>

          <Section title="8. Ответственность сторон">
            <p>
              За неисполнение или ненадлежащее исполнение обязательств по настоящему
              Договору стороны несут ответственность в соответствии с законодательством
              Российской Федерации.
            </p>
            <p>
              Стороны освобождаются от ответственности при возникновении обстоятельств
              непреодолимой силы (форс-мажор).
            </p>
          </Section>

          <Section title="9. Конфиденциальность">
            <p>
              Стороны обязуются не разглашать третьим лицам конфиденциальную информацию,
              полученную в ходе исполнения настоящего Договора. Исполнитель вправе использовать
              факт выполнения проекта и общедоступные материалы в собственном портфолио, если
              иное не согласовано отдельно.
            </p>
          </Section>

          <Section title="10. Заключительные положения">
            <p>
              Настоящая Оферта вступает в силу с момента её размещения на сайте {LEGAL.site}
              {" "}и действует бессрочно. Исполнитель вправе в одностороннем порядке вносить
              изменения в условия Оферты. Все споры разрешаются путём переговоров, а при
              недостижении соглашения - в судебном порядке по месту нахождения Исполнителя.
            </p>
            <p>
              Все вопросы по условиям Оферты направляются на email{" "}
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
