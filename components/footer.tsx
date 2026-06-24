export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-base font-bold text-violet-600">Aesthetic Training Hub</p>
          <p className="mt-1 text-xs text-zinc-500">Vetted UK aesthetics trainers, by specialism and location.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600">
          <a href="#" className="transition-colors hover:text-violet-600">About</a>
          <a href="#" className="transition-colors hover:text-violet-600">Pricing</a>
          <a href="#" className="transition-colors hover:text-violet-600">Contact</a>
          <a href="#" className="transition-colors hover:text-violet-600">List your practice</a>
        </nav>
      </div>
      <div className="border-t border-zinc-100">
        <p className="mx-auto max-w-4xl px-4 py-4 text-xs text-zinc-400 sm:px-6">
          © {year} Aesthetic Training Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
