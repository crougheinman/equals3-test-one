export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <span className="text-base font-bold text-indigo-600 sm:text-lg dark:text-indigo-400">
          Aesthetic Training Hub
        </span>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-zinc-900 px-3 py-2 text-xs font-medium text-white sm:px-4 sm:text-sm dark:bg-white dark:text-zinc-900">
          List your practice
        </span>
      </div>
    </header>
  );
}
