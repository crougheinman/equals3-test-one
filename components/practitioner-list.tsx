import type { Practitioner } from "@/lib/types";
import { PractitionerCard } from "@/components/practitioner-card";

export function PractitionerList({ practitioners }: { practitioners: Practitioner[] }) {
  if (practitioners.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
        No practitioners match your filters.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {practitioners.map((p, i) => (
        <div key={p.id} className="card-enter h-full" style={{ animationDelay: `${i * 40}ms` }}>
          <PractitionerCard practitioner={p} />
        </div>
      ))}
    </div>
  );
}
