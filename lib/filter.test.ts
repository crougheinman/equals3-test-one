import { describe, it, expect } from "vitest";
import { filterPractitioners, uniqueSpecialisms, uniqueLocations } from "@/lib/filter";
import type { Practitioner } from "@/lib/types";

const p = (over: Partial<Practitioner>): Practitioner => ({
  id: 1, name: "X", specialisms: ["Botox"], location: "London",
  tier: "standard", verified: true, profile_picture: null, ...over,
});

const list: Practitioner[] = [
  p({ id: 1, name: "Ana", specialisms: ["Botox", "Skin Peels"], location: "London" }),
  p({ id: 2, name: "Ben", specialisms: ["Dermal Fillers"], location: "Leeds" }),
  p({ id: 3, name: "Cas", specialisms: ["Botox"], location: "Leeds" }),
];

describe("filterPractitioners", () => {
  it("returns all when both filters are 'all'", () => {
    expect(filterPractitioners(list, { specialism: "all", location: "all" })).toHaveLength(3);
  });
  it("matches specialism inside the array", () => {
    const r = filterPractitioners(list, { specialism: "Botox", location: "all" });
    expect(r.map((x) => x.id)).toEqual([1, 3]);
  });
  it("ANDs specialism + location", () => {
    const r = filterPractitioners(list, { specialism: "Botox", location: "Leeds" });
    expect(r.map((x) => x.id)).toEqual([3]);
  });
  it("returns empty when nothing matches", () => {
    expect(filterPractitioners(list, { specialism: "PRP", location: "all" })).toHaveLength(0);
  });
});

describe("option derivation", () => {
  it("uniqueSpecialisms flattens + sorts + dedupes", () => {
    expect(uniqueSpecialisms(list)).toEqual(["Botox", "Dermal Fillers", "Skin Peels"]);
  });
  it("uniqueLocations sorts + dedupes", () => {
    expect(uniqueLocations(list)).toEqual(["Leeds", "London"]);
  });
});
