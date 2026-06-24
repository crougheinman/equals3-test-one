import type { Practitioner } from "@/lib/types";
import { TIER_PRICE } from "@/lib/pricing";
import { Ribbon } from "@/components/ribbon";
import { SpecialismTags } from "@/components/specialism-tags";

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-violet-600" aria-hidden>
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
  const base = "relative flex h-full flex-col gap-1.5 rounded-xl p-4 transition-shadow hover:shadow-md";
  const style = premium
    ? "border border-violet-200 bg-violet-50 shadow-sm"
    : "border border-zinc-200 bg-white";

  return (
    <article className={`${base} ${style}`}>
      {premium && <Ribbon />}
      <h3 className="pr-16 text-base font-semibold text-zinc-900">{practitioner.name}</h3>
      <p className="flex items-center gap-1 text-xs text-zinc-500">
        <PinIcon /> {practitioner.location}
      </p>
      <SpecialismTags specialisms={practitioner.specialisms} />
      <p className="mt-0.5 text-sm">
        <span className="font-semibold text-violet-700">£{TIER_PRICE[practitioner.tier]}</span>
        <span className="text-zinc-500"> /month</span>
      </p>
    </article>
  );
}
