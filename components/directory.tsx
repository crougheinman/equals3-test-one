"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Practitioner } from "@/lib/types";
import { filterPractitioners, uniqueSpecialisms, uniqueLocations } from "@/lib/filter";
import { FilterBar } from "@/components/filter-bar";
import { LocationChips } from "@/components/location-chips";
import { PractitionerList } from "@/components/practitioner-list";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 10;

export function Directory({ practitioners }: { practitioners: Practitioner[] }) {
  const [specialism, setSpecialism] = useState("all");
  const [location, setLocation] = useState("all");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const specialisms = useMemo(() => uniqueSpecialisms(practitioners), [practitioners]);
  const locations = useMemo(() => uniqueLocations(practitioners), [practitioners]);
  const results = useMemo(
    () => filterPractitioners(practitioners, { specialism, location }),
    [practitioners, specialism, location],
  );

  // Reset to the first page whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [specialism, location]);

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages); // clamp if filters shrank the list
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = results.slice(start, start + PAGE_SIZE);

  const reset = () => {
    setSpecialism("all");
    setLocation("all");
  };

  const goToPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={topRef} className="flex scroll-mt-6 flex-col gap-6">
      <FilterBar specialisms={specialisms} value={specialism} onChange={setSpecialism} onReset={reset} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Find an aesthetics trainer
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {total === 0
            ? "No trainers found"
            : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total} trainer${total === 1 ? "" : "s"}`}
        </p>
      </div>
      <LocationChips locations={locations} value={location} onChange={setLocation} />
      <PractitionerList key={`${specialism}|${location}|${currentPage}`} practitioners={pageItems} />
      <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
    </div>
  );
}
