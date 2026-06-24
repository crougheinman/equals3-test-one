export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Aesthetic Training Hub</span>
        <span className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
          List your practice
        </span>
      </div>
    </header>
  );
}
