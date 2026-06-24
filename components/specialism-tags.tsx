export function SpecialismTags({ specialisms }: { specialisms: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {specialisms.map((s) => (
        <span
          key={s}
          className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
