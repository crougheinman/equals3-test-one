import type { Practitioner } from "@/lib/types";

export type Filters = { specialism: string; location: string };

export function filterPractitioners(list: Practitioner[], f: Filters): Practitioner[] {
  return list.filter((p) => {
    const specOk = f.specialism === "all" || p.specialisms.includes(f.specialism);
    const locOk = f.location === "all" || p.location === f.location;
    return specOk && locOk;
  });
}

export function uniqueSpecialisms(list: Practitioner[]): string[] {
  return [...new Set(list.flatMap((p) => p.specialisms))].sort();
}

export function uniqueLocations(list: Practitioner[]): string[] {
  return [...new Set(list.map((p) => p.location))].sort();
}
