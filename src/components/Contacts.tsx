type Props = {
  eyebrow: string;
  title: string;
  text: string;
  email: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  github: string;
};

export default function Contacts(p: Props) {
  const items = [
    { label: "Email", value: p.email, href: p.email ? `mailto:${p.email}` : "" },
    { label: "Телефон", value: p.phone, href: p.phone ? `tel:${p.phone.replace(/[^+\d]/g, "")}` : "" },
    { label: "Telegram", value: p.telegram, href: p.telegram, external: true },
    { label: "WhatsApp", value: p.whatsapp, href: p.whatsapp, external: true },
    { label: "GitHub", value: p.github, href: p.github, external: true },
  ].filter((x) => x.value);

  return (
    <section id="contacts" className="py-20 md:py-28">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="eyebrow mb-6">{p.eyebrow}</div>
            <h2 className="font-serif text-4xl md:text-5xl">
              <span className="italic text-accent">{p.title}</span>
            </h2>
            <p className="mt-6 max-w-md text-text-muted">{p.text}</p>
          </div>
          <div className="md:col-span-7">
            <ul className="divide-y divide-text/5 rounded-2xl border border-text/5 bg-bg-card">
              {items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    target={it.external ? "_blank" : undefined}
                    rel={it.external ? "noreferrer noopener" : undefined}
                    className="group flex items-center justify-between px-6 py-5 transition hover:bg-bg-elevated"
                  >
                    <div>
                      <div className="text-xs uppercase tracking-wider text-text-dim">
                        {it.label}
                      </div>
                      <div className="mt-1 text-base text-text">{it.value}</div>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-text/10 text-text-muted transition group-hover:border-accent group-hover:text-accent">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
