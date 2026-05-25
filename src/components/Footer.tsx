import { LEGAL } from "@/lib/legal";

export default function Footer({ copy }: { copy: string }) {
  return (
    <footer className="border-t border-text/5 py-10">
      <div className="container-site space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-sm text-text-muted">
            <div className="text-text">{LEGAL.entity}</div>
            <div className="mt-2 text-xs leading-relaxed text-text-dim">
              ОГРНИП: {LEGAL.ogrnip}
              <br />
              ИНН: {LEGAL.inn}
              <br />
              г. {LEGAL.city}
            </div>
          </div>

          <div className="text-sm text-text-muted">
            <div className="text-xs uppercase tracking-wider text-text-dim">Контакты</div>
            <div className="mt-2 space-y-1">
              <div>
                <a href={`tel:${LEGAL.phone}`} className="hover:text-accent">
                  {LEGAL.phoneDisplay}
                </a>
              </div>
              <div>
                <a href={`mailto:${LEGAL.email}`} className="hover:text-accent">
                  {LEGAL.email}
                </a>
              </div>
            </div>
          </div>

          <div className="text-sm text-text-muted">
            <div className="text-xs uppercase tracking-wider text-text-dim">Сайт</div>
            <div className="mt-2 space-y-1">
              <div>
                <a href="/about" className="hover:text-accent">
                  Обо мне
                </a>
              </div>
              <div>
                <a href="/uslugi" className="hover:text-accent">
                  Услуги
                </a>
              </div>
              <div>
                <a href="/privacy" className="hover:text-accent">
                  Политика конфиденциальности
                </a>
              </div>
              <div>
                <a href="/offer" className="hover:text-accent">
                  Публичная оферта
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-text/5 pt-6 text-xs text-text-dim md:flex-row md:items-center">
          <div>
            {copy} · {new Date().getFullYear()}
          </div>
          <div>
            <a href="/admin" className="hover:text-text-muted">
              admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
