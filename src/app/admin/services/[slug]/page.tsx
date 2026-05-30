import { notFound } from "next/navigation";
import ServiceForm from "../ServiceForm";
import { getServiceBySlug } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getServiceBySlug(slug);
  if (!item) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">
        Редактируем <span className="italic text-accent">{item.cardTitle || item.slug}</span>
      </h1>
      <ServiceForm initial={item} originalSlug={item.slug} />
    </div>
  );
}
