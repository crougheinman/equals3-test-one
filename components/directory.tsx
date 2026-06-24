"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Practitioner } from "@/lib/types";
import { filterPractitioners, uniqueSpecialisms, uniqueLocations } from "@/lib/filter";
import { FilterBar } from "@/components/filter-bar";
import { LocationChips } from "@/components/location-chips";
import { PractitionerList } from "@/components/practitioner-list";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 12;

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
      <p className="text-sm text-zinc-500">
        {total === 0
          ? "No trainers found"
          : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total} trainer${total === 1 ? "" : "s"}`}
      </p>
      <LocationChips locations={locations} value={location} onChange={setLocation} />
      <PractitionerList key={`${specialism}|${location}|${currentPage}`} practitioners={pageItems} />
      <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
    </div>
  );
}
