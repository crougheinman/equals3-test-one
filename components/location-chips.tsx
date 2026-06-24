export function LocationChips({
  locations,
  value,
  onChange,
}: {
  locations: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const chips = ["all", ...locations];
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((loc) => {
        const active = loc === value;
        return (
          <button
            key={loc}
            onClick={() => onChange(loc)}
            className={
              "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors " +
              (active
                ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/15 dark:text-violet-300"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800")
            }
          >
            {loc === "all" ? "All locations" : loc}
          </button>
        );
      })}
    </div>
  );
}
