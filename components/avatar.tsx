function initials(name: string): string {
  return name
    .replace(/^Dr\.\s*/i, "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Initials monogram (no photo) — fills the ProfileCard-style overlapping avatar slot.
export function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-violet-600 text-lg font-bold text-white shadow-md">
      {initials(name)}
    </div>
  );
}
