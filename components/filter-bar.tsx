import { FilterSelect } from "@/components/filter-select";

export function FilterBar({
  specialisms,
  specialism,
  onSpecialismChange,
  locations,
  location,
  onLocationChange,
  onReset,
}: {
  specialisms: string[];
  specialism: string;
  onSpecialismChange: (v: string) => void;
  locations: string[];
  location: string;
  onLocationChange: (v: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
      <FilterSelect
        label="Specialism"
        value={specialism}
        onChange={onSpecialismChange}
        options={specialisms}
        allLabel="All specialisms"
      />
      <FilterSelect
        label="Location"
        value={location}
        onChange={onLocationChange}
        options={locations}
        allLabel="All locations"
      />
      <button
        onClick={onReset}
        className="ml-auto text-sm font-medium text-violet-600 transition-colors hover:underline"
      >
        Reset filters
      </button>
    </div>
  );
}
