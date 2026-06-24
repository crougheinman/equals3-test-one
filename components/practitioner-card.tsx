import type { Practitioner } from "@/lib/types";
import { TIER_PRICE } from "@/lib/pricing";
import { Ribbon } from "@/components/ribbon";
import { Avatar } from "@/components/avatar";
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

  return (
    <article
      className={`group relative flex h-full flex-col rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1.5 ${
        premium
          ? "border-violet-300 bg-violet-50 ring-2 ring-violet-300/60 shadow-lg shadow-violet-300/40 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-400/50"
          : "border-zinc-200 bg-white shadow-sm hover:border-violet-200 hover:shadow-xl hover:shadow-violet-200/40"
      }`}
    >
      {premium && <Ribbon />}

      {/* Header band — vivid violet for premium, muted for standard */}
      <div className="h-16 overflow-hidden rounded-t-2xl">
        <div
          className={`h-full w-full bg-gradient-to-br transition-transform duration-500 ease-out group-hover:scale-105 ${
            premium ? "from-violet-500 to-violet-700" : "from-violet-200 to-violet-300"
          }`}
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 px-4 pb-4">
        <div className="-mt-8 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-105">
          <Avatar name={practitioner.name} />
        </div>
        <h3 className="mt-1 text-base font-semibold text-zinc-900 transition-colors group-hover:text-violet-700">
          {practitioner.name}
        </h3>
        <p className="flex items-center gap-1 text-xs text-zinc-500">
          <PinIcon /> {practitioner.location}
        </p>
        <SpecialismTags specialisms={practitioner.specialisms} />
        <div className="mt-auto border-t border-violet-100 pt-3">
          <span className="text-base font-bold text-violet-700">£{TIER_PRICE[practitioner.tier]}</span>
          <span className="text-xs text-zinc-500"> /month</span>
        </div>
      </div>
    </article>
  );
}
