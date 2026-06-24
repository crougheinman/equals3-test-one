export function FilterBar({
  specialisms,
  value,
  onChange,
  onReset,
}: {
  specialisms: string[];
  value: string;
  onChange: (v: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Specialism</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-transparent py-1.5 pl-2 pr-6 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
        >
          <option value="all">All specialisms</option>
          {specialisms.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={onReset}
        className="ml-auto text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        Reset filters
      </button>
    </div>
  );
}
