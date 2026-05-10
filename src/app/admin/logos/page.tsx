import { listLogos } from "@/lib/content";
import LogosManager from "./LogosManager";

export const dynamic = "force-dynamic";

export default function LogosPage() {
  const logos = listLogos();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">
        Логотипы <span className="italic text-accent">клиентов</span>
      </h1>
      <p className="mt-2 text-text-muted">
        Лента логотипов под hero-блоком. Лучше использовать SVG или PNG с прозрачным фоном.
      </p>
      <LogosManager initial={logos} />
    </div>
  );
}
