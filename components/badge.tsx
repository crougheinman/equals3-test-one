const STYLES = {
  featured: "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-400/15 dark:text-amber-300",
  verified: "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-400/15 dark:text-indigo-300",
} as const;

const LABELS = { featured: "★ Featured", verified: "✓ Verified" } as const;

export function Badge({ variant }: { variant: keyof typeof STYLES }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STYLES[variant]}`}
    >
      {LABELS[variant]}
    </span>
  );
}
