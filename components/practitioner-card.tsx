import type { Practitioner } from "@/lib/types";
import { Ribbon } from "@/components/ribbon";
import { SpecialismTags } from "@/components/specialism-tags";

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 2a5 5 0 0 0-5 5c0 3.5 5 11 5 11s5-7.5 5-11a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PractitionerCard({ practitioner }: { practitioner: Practitioner }) {
  const premium = practitioner.tier === "premium";
  const base = "relative flex flex-col gap-2 p-5 pr-24 rounded-2xl transition-colors";
  const style = premium
    ? "border-l-4 border-amber-400 bg-amber-50/60 ring-1 ring-amber-200/70 shadow-sm dark:bg-amber-400/5 dark:ring-amber-400/20"
    : "border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900";

  return (
    <article className={`${base} ${style}`}>
      {premium && <Ribbon />}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{practitioner.name}</h3>
      <p className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
        <PinIcon /> {practitioner.location}
      </p>
      <SpecialismTags specialisms={practitioner.specialisms} />
    </article>
  );
}
