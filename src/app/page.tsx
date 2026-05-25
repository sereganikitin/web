import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Services from "@/components/Services";
import SelectedWork from "@/components/SelectedWork";
import About from "@/components/About";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import PopupCTA from "@/components/PopupCTA";
import Reveal from "@/components/Reveal";
import { getContent, listLogos, listPortfolio } from "@/lib/content";

const SITE_URL = process.env.SITE_URL ?? "https://web.cd-agency.ru";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const c = getContent();
  const logos = listLogos();
  const portfolio = listPortfolio({ publishedOnly: true });

  // WebPage с speakable и lastReviewed — для голосовых ассистентов и AI.
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: c["site.title"] ?? "Сергей Никитин — веб-разработка",
    description: c["site.description"] ?? undefined,
    inLanguage: "ru-RU",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    lastReviewed: new Date().toISOString().slice(0, 10),
    primaryImageOfPage: c["hero.image"]
      ? { "@type": "ImageObject", url: new URL(c["hero.image"], SITE_URL).toString() }
      : undefined,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".speakable"],
    },
  };

  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow={c["hero.eyebrow"] ?? ""}
          line1={c["hero.title_line1"] ?? ""}
          line2={c["hero.title_line2"] ?? ""}
          subtitle={c["hero.subtitle"] ?? ""}
          ctaLabel={c["hero.cta_label"] ?? ""}
          ctaHref={c["hero.cta_href"] ?? "#services"}
          image={c["hero.image"] || undefined}
        />
        <ClientLogos logos={logos} />
        <Reveal>
          <Services
            eyebrow={c["services.eyebrow"] ?? "Услуги"}
            items={[
              {
                num: c["services.s1.num"] ?? "01",
                title: c["services.s1.title"] ?? "",
                text: c["services.s1.text"] ?? "",
                href: c["services.s1.href"] || "/uslugi/lending",
              },
              {
                num: c["services.s2.num"] ?? "02",
                title: c["services.s2.title"] ?? "",
                text: c["services.s2.text"] ?? "",
                href: c["services.s2.href"] || "/uslugi/integraciya-crm",
              },
              {
                num: c["services.s3.num"] ?? "03",
                title: c["services.s3.title"] ?? "",
                text: c["services.s3.text"] ?? "",
                href: c["services.s3.href"] || "/uslugi/telegram-bot",
              },
            ]}
          />
        </Reveal>
        <Reveal>
          <SelectedWork
            eyebrow={c["work.eyebrow"] ?? "Selected"}
            title={c["work.title"] ?? "Работы"}
            items={portfolio}
          />
        </Reveal>
        <Reveal>
          <About
            eyebrow={c["about.eyebrow"] ?? "Обо мне"}
            title={c["about.title"] ?? ""}
            text={c["about.text"] ?? ""}
            image={c["hero.image"] || undefined}
          />
        </Reveal>
        <Reveal>
          <Contacts
            eyebrow={c["contacts.eyebrow"] ?? "Контакты"}
            title={c["contacts.title"] ?? ""}
            text={c["contacts.text"] ?? ""}
            email={c["contacts.email"] ?? ""}
            phone={c["contacts.phone"] ?? ""}
            telegram={c["contacts.telegram"] ?? ""}
            whatsapp={c["contacts.whatsapp"] ?? ""}
            github={c["contacts.github"] ?? ""}
          />
        </Reveal>
      </main>
      <Footer copy={c["footer.copy"] ?? "© Сергей Никитин"} />
      <PopupCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
    </>
  );
}
