import StarForm from "../StarForm";

export default function NewStarPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">
        Новая <span className="text-accent">звезда</span>
      </h1>
      <StarForm
        initial={{
          slug: "",
          name: "",
          role: "",
          text: "",
          photo: null,
          video: null,
          video_embed: null,
          position: 100,
          is_published: 1,
        }}
      />
    </div>
  );
}
