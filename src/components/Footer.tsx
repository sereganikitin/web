export default function Footer({ copy }: { copy: string }) {
  return (
    <footer className="border-t border-text/5 py-8">
      <div className="container-site flex flex-col items-center justify-between gap-3 text-xs text-text-dim md:flex-row">
        <div>
          {copy} · {new Date().getFullYear()}
        </div>
        <div>
          <a href="/admin" className="hover:text-text-muted">
            admin
          </a>
        </div>
      </div>
    </footer>
  );
}
