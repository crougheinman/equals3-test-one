"use client";

import { useMemo, useState } from "react";
import type { Practitioner } from "@/lib/types";
import { filterPractitioners, uniqueSpecialisms, uniqueLocations } from "@/lib/filter";
import { FilterBar } from "@/components/filter-bar";
import { LocationChips } from "@/components/location-chips";
import { PractitionerList } from "@/components/practitioner-list";

export function Directory({ practitioners }: { practitioners: Practitioner[] }) {
  const [specialism, setSpecialism] = useState("all");
  const [location, setLocation] = useState("all");

  const specialisms = useMemo(() => uniqueSpecialisms(practitioners), [practitioners]);
  const locations = useMemo(() => uniqueLocations(practitioners), [practitioners]);
  const results = useMemo(
    () => filterPractitioners(practitioners, { specialism, location }),
    [practitioners, specialism, location],
  );

  const reset = () => {
    setSpecialism("all");
    setLocation("all");
  };

  return (
    <div className="flex flex-col gap-6">
      <FilterBar specialisms={specialisms} value={specialism} onChange={setSpecialism} onReset={reset} />
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Find an aesthetics trainer
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Showing {results.length} trainer{results.length === 1 ? "" : "s"}
        </p>
      </div>
      <LocationChips locations={locations} value={location} onChange={setLocation} />
      <PractitionerList practitioners={results} />
    </div>
  );
}
