import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Services from "@/components/Services";
import SelectedWork from "@/components/SelectedWork";
import About from "@/components/About";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import PopupCTA from "@/components/PopupCTA";
import { getContent, listLogos, listPortfolio } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const c = getContent();
  const logos = listLogos();
  const portfolio = listPortfolio({ publishedOnly: true });

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
        <Services
          eyebrow={c["services.eyebrow"] ?? "Услуги"}
          items={[
            {
              num: c["services.s1.num"] ?? "01",
              title: c["services.s1.title"] ?? "",
              text: c["services.s1.text"] ?? "",
            },
            {
              num: c["services.s2.num"] ?? "02",
              title: c["services.s2.title"] ?? "",
              text: c["services.s2.text"] ?? "",
            },
            {
              num: c["services.s3.num"] ?? "03",
              title: c["services.s3.title"] ?? "",
              text: c["services.s3.text"] ?? "",
            },
          ]}
        />
        <SelectedWork
          eyebrow={c["work.eyebrow"] ?? "Selected"}
          title={c["work.title"] ?? "Работы"}
          items={portfolio}
        />
        <About
          eyebrow={c["about.eyebrow"] ?? "Обо мне"}
          title={c["about.title"] ?? ""}
          text={c["about.text"] ?? ""}
          image={c["hero.image"] || undefined}
        />
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
      </main>
      <Footer copy={c["footer.copy"] ?? "© Сергей Никитин"} />
      <PopupCTA />
    </>
  );
}
