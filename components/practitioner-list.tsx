import type { Practitioner } from "@/lib/types";
import { PractitionerCard } from "@/components/practitioner-card";

export function PractitionerList({ practitioners }: { practitioners: Practitioner[] }) {
  if (practitioners.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
        No practitioners match your filters.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {practitioners.map((p) => (
        <PractitionerCard key={p.id} practitioner={p} />
      ))}
    </div>
  );
}
