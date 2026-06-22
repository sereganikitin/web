import { listLeads } from "@/lib/leads";
import LeadsManager from "./LeadsManager";

export const dynamic = "force-dynamic";

export default function AdminLeadsPage() {
  const leads = listLeads();
  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl">
        <span className="text-accent">Заявки</span>
      </h1>
      <p className="mt-2 text-text-muted">
        Заявки с контактной формы и попапа. Всего: {leads.length}.
      </p>
      <div className="mt-6">
        <LeadsManager initial={leads} />
      </div>
    </div>
  );
}
