import { notFound } from "next/navigation";
import PortfolioForm from "../PortfolioForm";
import { getPortfolio } from "@/lib/content";

export const dynamic = "force-dynamic";

function parseGallery(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getPortfolio(Number(id));
  if (!item) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">
        Редактировать <span className="text-accent">{item.title}</span>
      </h1>
      <PortfolioForm
        initial={{
          id: item.id,
          slug: item.slug,
          title: item.title,
          category: item.category,
          description: item.description,
          content: item.content ?? "",
          gallery: parseGallery(item.gallery),
          client: item.client ?? "",
          year: item.year ?? "",
          image: item.image,
          link: item.link,
          position: item.position,
          is_published: item.is_published,
        }}
      />
    </div>
  );
}
