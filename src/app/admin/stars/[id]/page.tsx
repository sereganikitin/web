import { notFound } from "next/navigation";
import StarForm from "../StarForm";
import { getStar } from "@/lib/stars";

export const dynamic = "force-dynamic";

export default async function EditStarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const star = getStar(Number(id));
  if (!star) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">
        Редактировать <span className="text-accent">{star.name}</span>
      </h1>
      <StarForm
        initial={{
          id: star.id,
          slug: star.slug,
          name: star.name,
          role: star.role,
          text: star.text,
          photo: star.photo,
          video: star.video,
          video_embed: star.video_embed,
          position: star.position,
          is_published: star.is_published,
        }}
      />
    </div>
  );
}
