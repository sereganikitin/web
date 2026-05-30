import ServiceForm from "../ServiceForm";

export const dynamic = "force-dynamic";

export default function AdminServiceNewPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">
        Новая <span className="italic text-accent">услуга</span>
      </h1>
      <ServiceForm
        initial={{
          slug: "",
          position: 0,
          metaTitle: "",
          metaDescription: "",
          cardTitle: "",
          cardSummary: "",
          cardKeywords: [],
          eyebrow: "Услуги",
          h1: "",
          intro: "",
          includes: [],
          pricing: { priceFrom: "", deadline: "" },
          faq: [],
          caseSlugs: [],
        }}
      />
    </div>
  );
}
