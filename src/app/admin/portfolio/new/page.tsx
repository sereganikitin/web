import PortfolioForm from "../PortfolioForm";

export default function NewPortfolioPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">
        Новый <span className="text-accent">кейс</span>
      </h1>
      <PortfolioForm
        initial={{
          slug: "",
          title: "",
          category: "",
          description: "",
          content: "",
          gallery: [],
          client: "",
          year: "",
          image: null,
          link: null,
          position: 100,
          is_published: 1,
        }}
      />
    </div>
  );
}
