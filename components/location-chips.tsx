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
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " +
              (active
                ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/15 dark:text-indigo-300"
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
