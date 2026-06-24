// ponytail: renders one button per page. Fine for tens of pages; if the dataset
// grows to hundreds, add a windowed range with ellipses.
export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";
  const idle = "border-zinc-200 text-zinc-600 hover:bg-zinc-50";

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button className={`${btn} ${idle}`} onClick={() => onChange(page - 1)} disabled={page === 1}>
        Prev
      </button>
      {pages.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          className={`${btn} ${n === page ? "border-violet-600 bg-violet-600 text-white" : idle}`}
        >
          {n}
        </button>
      ))}
      <button className={`${btn} ${idle}`} onClick={() => onChange(page + 1)} disabled={page === totalPages}>
        Next
      </button>
    </nav>
  );
}
