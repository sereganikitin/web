import { readSession } from "@/lib/auth";
import ChangePasswordForm from "./ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await readSession();
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl">
        <span className="text-accent">Аккаунт</span>
      </h1>
      <p className="mt-2 text-text-muted">
        Текущий логин: <span className="text-text">{session?.login}</span>
      </p>

      <div className="mt-8 rounded-2xl border border-text/5 bg-bg-card p-6">
        <h2 className="font-serif text-xl">Смена пароля</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
