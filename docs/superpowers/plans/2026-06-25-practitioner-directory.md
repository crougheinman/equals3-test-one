# Practitioner Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public Aesthetic Training Hub practitioner directory — a Supabase-backed Next.js page listing ~30 vetted UK trainers with Featured (premium) prominence, a Verified badge, and combinable specialism + location filters.

**Architecture:** Server Component (`app/page.tsx`) fetches all practitioners from Supabase via an anon client and passes the array to a `'use client'` Directory component that holds filter state and filters/sorts in-memory. UI is decomposed into small single-purpose components (badge, avatar, card, list, filter controls). Pure filter/sort logic lives in `lib/filter.ts` and is unit-tested.

**Tech Stack:** Next.js 16.2.9 (App Router), React 19, Supabase JS, Tailwind v4, TypeScript. Vitest (dev-only) for the pure-logic test.

## Global Constraints

- **Next.js 16 breaking changes:** `params`/`searchParams` are Promises (we avoid them — filter state is client-side). `fetch` is uncached by default. `'use client'` goes at the very top of the file, before imports. Server-fetched data passes to Client Components as serializable props.
- **No new *runtime* dependencies.** UI uses Tailwind v4 utilities + native `<select>`/buttons. Vitest is the only added dependency, dev-only, for the filter test.
- **Supabase:** anon client from `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already in `.env.local`). RLS on, anon `SELECT` only.
- **Public copy rule:** never render the word "Standard". Premium → gold `★ Featured`. Vetted → `✓ Verified`. `tier` stays internal (ranking + Featured badge).
- **Data model:** `practitioner_tier` enum (`'standard'`,`'premium'`); `specialisms text[]`; `verified boolean`; `profile_picture text` nullable.
- **Import alias:** `@/*` → project root (e.g. `@/lib/...`, `@/components/...`).
- **Component-based:** small focused files, no spaghetti. Data logic out of view components.
- **Commit after each task.**

---

### Task 1: Remove the conflicting Drizzle integration

**Files:**
- Delete: `lib/db.ts`, `lib/schema.ts`, `scripts/seed.ts`
- Modify: `package.json` (drop `drizzle-orm`, `drizzle-kit`, `postgres`)

- [ ] **Step 1: Delete Drizzle files**

```bash
git rm lib/db.ts lib/schema.ts scripts/seed.ts
```

- [ ] **Step 2: Remove Drizzle deps from package.json**

Remove these lines from `dependencies`: `"drizzle-orm": "^0.45.2",` and `"postgres": "^3.4.9",`. Remove from `devDependencies`: `"drizzle-kit": "^0.31.10",`.

- [ ] **Step 3: Reinstall to sync lockfile**

Run: `npm install`
Expected: completes; lockfile updated; no drizzle/postgres in `node_modules/.package-lock` top level.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove conflicting drizzle integration (use Supabase)"
```

---

### Task 2: Types + Supabase client + data access

**Files:**
- Create: `lib/types.ts`, `lib/supabase.ts`, `lib/practitioners.ts`

**Interfaces:**
- Produces: `Practitioner` type; `getPractitioners(): Promise<Practitioner[]>` (premium-first, then name).

- [ ] **Step 1: `lib/types.ts`**

```ts
export type Tier = "standard" | "premium";

export type Practitioner = {
  id: number;
  name: string;
  specialisms: string[];
  location: string;
  tier: Tier;
  verified: boolean;
  profile_picture: string | null;
};
```

- [ ] **Step 2: `lib/supabase.ts`**

```ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anonKey);
```

- [ ] **Step 3: `lib/practitioners.ts`** (data access — keeps queries out of components)

```ts
import { supabase } from "@/lib/supabase";
import type { Practitioner } from "@/lib/types";

// Premium first (enum sorts standard<premium, so descending), then name A–Z.
export async function getPractitioners(): Promise<Practitioner[]> {
  const { data, error } = await supabase
    .from("practitioners")
    .select("id, name, specialisms, location, tier, verified, profile_picture")
    .order("tier", { ascending: false })
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to load practitioners: ${error.message}`);
  return (data ?? []) as Practitioner[];
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/types.ts lib/supabase.ts lib/practitioners.ts
git commit -m "feat: add Practitioner type, Supabase client, data access"
```

---

### Task 3: Pure filter + sort logic (TDD)

**Files:**
- Create: `lib/filter.ts`, `lib/filter.test.ts`
- Modify: `package.json` (add vitest dev dep + `test` script)

**Interfaces:**
- Produces:
  - `filterPractitioners(list, { specialism, location }): Practitioner[]` — `specialism`/`location` are `string | "all"`; AND logic; specialism matches if value ∈ `p.specialisms`.
  - `uniqueSpecialisms(list): string[]` — sorted unique, flattened.
  - `uniqueLocations(list): string[]` — sorted unique.

- [ ] **Step 1: Add vitest + script**

```bash
npm install -D vitest
```

In `package.json` `scripts`, add: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing test — `lib/filter.test.ts`**

```ts
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
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/filter` / functions not defined.

- [ ] **Step 4: Implement `lib/filter.ts`**

```ts
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
```

- [ ] **Step 5: Run test, verify it passes**

Run: `npm test`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/filter.ts lib/filter.test.ts package.json package-lock.json
git commit -m "feat: pure filter/sort logic with vitest coverage"
```

---

### Task 4: Database schema + seed (`supabase/seed.sql`)

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: Write `supabase/seed.sql`** — enum, table, RLS, ~30 rows

```sql
-- Aesthetic Training Hub — practitioner directory schema + seed.
-- Run in the Supabase SQL editor.

create type practitioner_tier as enum ('standard', 'premium');

create table practitioners (
  id bigint generated always as identity primary key,
  name text not null,
  specialisms text[] not null,
  location text not null,
  tier practitioner_tier not null,
  verified boolean not null default true,
  profile_picture text,
  created_at timestamptz not null default now()
);

alter table practitioners enable row level security;

create policy "Public can read practitioners"
  on practitioners for select
  to anon
  using (true);

insert into practitioners (name, specialisms, location, tier, verified, profile_picture) values
  ('Dr. Amelia Hart', '{Botox / Anti-wrinkle,Dermal Fillers}', 'London', 'premium', true, 'https://randomuser.me/api/portraits/women/11.jpg'),
  ('James Okafor', '{Dermal Fillers,Lip Enhancement}', 'Manchester', 'premium', true, 'https://randomuser.me/api/portraits/men/12.jpg'),
  ('Priya Nair', '{Skin Peels,Microneedling}', 'Birmingham', 'premium', true, 'https://randomuser.me/api/portraits/women/13.jpg'),
  ('Dr. Sofia Romano', '{Botox / Anti-wrinkle,Profhilo}', 'London', 'premium', true, 'https://randomuser.me/api/portraits/women/14.jpg'),
  ('Liam Stewart', '{Thread Lifts,Dermal Fillers}', 'Edinburgh', 'premium', true, 'https://randomuser.me/api/portraits/men/15.jpg'),
  ('Chloe Bennett', '{Lip Enhancement,Botox / Anti-wrinkle}', 'Leeds', 'premium', true, 'https://randomuser.me/api/portraits/women/16.jpg'),
  ('Dr. Omar Farouk', '{PRP,Microneedling}', 'Glasgow', 'premium', true, 'https://randomuser.me/api/portraits/men/17.jpg'),
  ('Hannah Price', '{Chemical Peels,Skin Peels}', 'Bristol', 'premium', true, 'https://randomuser.me/api/portraits/women/18.jpg'),
  ('Daniel Wright', '{Dermal Fillers,Profhilo}', 'Liverpool', 'premium', true, 'https://randomuser.me/api/portraits/men/19.jpg'),
  ('Dr. Yasmin Khan', '{Botox / Anti-wrinkle,Thread Lifts}', 'London', 'premium', true, 'https://randomuser.me/api/portraits/women/20.jpg'),
  ('Grace Sullivan', '{Microneedling,PRP}', 'Newcastle', 'premium', false, 'https://randomuser.me/api/portraits/women/21.jpg'),
  ('Mohammed Ali', '{Dermal Fillers,Lip Enhancement}', 'Cardiff', 'premium', true, 'https://randomuser.me/api/portraits/men/22.jpg'),
  ('Ella Thompson', '{Skin Peels,Botox / Anti-wrinkle}', 'Manchester', 'standard', true, 'https://randomuser.me/api/portraits/women/23.jpg'),
  ('Ryan Murphy', '{Dermal Fillers}', 'London', 'standard', true, 'https://randomuser.me/api/portraits/men/24.jpg'),
  ('Aisha Begum', '{Microneedling,Chemical Peels}', 'Birmingham', 'standard', true, 'https://randomuser.me/api/portraits/women/25.jpg'),
  ('Tom Harris', '{Botox / Anti-wrinkle}', 'Leeds', 'standard', true, 'https://randomuser.me/api/portraits/men/26.jpg'),
  ('Sophie Clarke', '{Lip Enhancement,Dermal Fillers}', 'Glasgow', 'standard', true, 'https://randomuser.me/api/portraits/women/27.jpg'),
  ('Nathan Evans', '{PRP}', 'Bristol', 'standard', false, 'https://randomuser.me/api/portraits/men/28.jpg'),
  ('Maria Santos', '{Profhilo,Skin Peels}', 'Liverpool', 'standard', true, 'https://randomuser.me/api/portraits/women/29.jpg'),
  ('Jacob Reid', '{Dermal Fillers,Thread Lifts}', 'Edinburgh', 'standard', true, 'https://randomuser.me/api/portraits/men/30.jpg'),
  ('Lucy Foster', '{Botox / Anti-wrinkle,Microneedling}', 'London', 'standard', true, 'https://randomuser.me/api/portraits/women/31.jpg'),
  ('Ben Carter', '{Skin Peels}', 'Newcastle', 'standard', true, 'https://randomuser.me/api/portraits/men/32.jpg'),
  ('Zara Mahmood', '{Lip Enhancement,Profhilo}', 'Cardiff', 'standard', true, 'https://randomuser.me/api/portraits/women/33.jpg'),
  ('Oliver Hughes', '{Dermal Fillers,Botox / Anti-wrinkle}', 'Manchester', 'standard', true, 'https://randomuser.me/api/portraits/men/34.jpg'),
  ('Freya Walsh', '{Chemical Peels,Microneedling}', 'Leeds', 'standard', false, 'https://randomuser.me/api/portraits/women/35.jpg'),
  ('Adam Foster', '{PRP,Dermal Fillers}', 'Glasgow', 'standard', true, 'https://randomuser.me/api/portraits/men/36.jpg'),
  ('Isla Morgan', '{Botox / Anti-wrinkle}', 'Bristol', 'standard', true, 'https://randomuser.me/api/portraits/women/37.jpg'),
  ('Harry Watson', '{Thread Lifts,Skin Peels}', 'Liverpool', 'standard', true, 'https://randomuser.me/api/portraits/men/38.jpg'),
  ('Megan Hill', '{Dermal Fillers,Lip Enhancement}', 'London', 'standard', true, 'https://randomuser.me/api/portraits/women/39.jpg'),
  ('Callum Shaw', '{Microneedling,Profhilo}', 'Edinburgh', 'standard', true, 'https://randomuser.me/api/portraits/men/40.jpg');
```

- [ ] **Step 2: Commit**

```bash
git add supabase/seed.sql
git commit -m "feat: add practitioners schema, RLS policy, 30-row seed"
```

> **Manual step (user):** run `supabase/seed.sql` in the Supabase SQL editor before the page will show data.

---

### Task 5: Presentational components — Badge, Avatar, SpecialismTags

**Files:**
- Create: `components/badge.tsx`, `components/avatar.tsx`, `components/specialism-tags.tsx`

**Interfaces:**
- Produces:
  - `Badge({ variant: "featured" | "verified" })` — gold Featured / indigo Verified pill.
  - `Avatar({ src, name, size? })` — `'use client'`; `<img>` with initials fallback on null/error.
  - `SpecialismTags({ specialisms })` — gray chip row.

- [ ] **Step 1: `components/badge.tsx`**

```tsx
const STYLES = {
  featured: "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-400/15 dark:text-amber-300",
  verified: "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-400/15 dark:text-indigo-300",
} as const;

const LABELS = { featured: "★ Featured", verified: "✓ Verified" } as const;

export function Badge({ variant }: { variant: keyof typeof STYLES }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STYLES[variant]}`}
    >
      {LABELS[variant]}
    </span>
  );
}
```

- [ ] **Step 2: `components/avatar.tsx`** (client — needs `onError`)

```tsx
"use client";

import { useState } from "react";

function initials(name: string): string {
  return name.replace(/^Dr\.\s*/i, "").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function Avatar({ src, name, size = 64 }: { src: string | null; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-200"
      style={{ width: size, height: size }}
    >
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} width={size} height={size} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span className="text-lg font-semibold">{initials(name)}</span>
      )}
    </div>
  );
}
```

- [ ] **Step 3: `components/specialism-tags.tsx`**

```tsx
export function SpecialismTags({ specialisms }: { specialisms: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {specialisms.map((s) => (
        <span
          key={s}
          className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/badge.tsx components/avatar.tsx components/specialism-tags.tsx
git commit -m "feat: badge, avatar (initials fallback), specialism tags"
```

---

### Task 6: Practitioner card + list

**Files:**
- Create: `components/practitioner-card.tsx`, `components/practitioner-list.tsx`

**Interfaces:**
- Consumes: `Practitioner`, `Avatar`, `Badge`, `SpecialismTags`.
- Produces:
  - `PractitionerCard({ practitioner })` — row; premium variant = elevated gold-accent card; standard = flat row. Featured badge if premium; Verified badge if verified.
  - `PractitionerList({ practitioners })` — maps cards; empty-state message.

- [ ] **Step 1: `components/practitioner-card.tsx`**

```tsx
import type { Practitioner } from "@/lib/types";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { SpecialismTags } from "@/components/specialism-tags";

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden>
      <path fillRule="evenodd" d="M10 2a5 5 0 0 0-5 5c0 3.5 5 11 5 11s5-7.5 5-11a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" clipRule="evenodd" />
    </svg>
  );
}

export function PractitionerCard({ practitioner }: { practitioner: Practitioner }) {
  const premium = practitioner.tier === "premium";
  const base = "flex gap-4 p-5 rounded-2xl transition-colors";
  const style = premium
    ? "border-l-4 border-amber-400 bg-amber-50/60 ring-1 ring-amber-200/70 shadow-sm dark:bg-amber-400/5 dark:ring-amber-400/20"
    : "border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900";

  return (
    <article className={`${base} ${style}`}>
      <Avatar src={practitioner.profile_picture} name={practitioner.name} />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{practitioner.name}</h3>
          {premium && <Badge variant="featured" />}
          {practitioner.verified && <Badge variant="verified" />}
        </div>
        <p className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
          <PinIcon /> {practitioner.location}
        </p>
        <SpecialismTags specialisms={practitioner.specialisms} />
      </div>
    </article>
  );
}
```

- [ ] **Step 2: `components/practitioner-list.tsx`**

```tsx
import type { Practitioner } from "@/lib/types";
import { PractitionerCard } from "@/components/practitioner-card";

export function PractitionerList({ practitioners }: { practitioners: Practitioner[] }) {
  if (practitioners.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
        No practitioners match your filters.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {practitioners.map((p) => (
        <PractitionerCard key={p.id} practitioner={p} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/practitioner-card.tsx components/practitioner-list.tsx
git commit -m "feat: practitioner card (featured variant) + list with empty state"
```

---

### Task 7: Filter controls — FilterBar + LocationChips

**Files:**
- Create: `components/filter-bar.tsx`, `components/location-chips.tsx`

**Interfaces:**
- Produces:
  - `FilterBar({ specialisms, value, onChange, onReset })` — uppercase-labelled `<select>` + Reset link.
  - `LocationChips({ locations, value, onChange })` — "All" + per-location pill buttons; active = indigo.

- [ ] **Step 1: `components/filter-bar.tsx`**

```tsx
export function FilterBar({
  specialisms, value, onChange, onReset,
}: {
  specialisms: string[];
  value: string;
  onChange: (v: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Specialism</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-transparent py-1.5 pl-2 pr-6 text-sm font-medium text-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
        >
          <option value="all">All specialisms</option>
          {specialisms.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <button onClick={onReset} className="ml-auto text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
        Reset filters
      </button>
    </div>
  );
}
```

- [ ] **Step 2: `components/location-chips.tsx`**

```tsx
export function LocationChips({
  locations, value, onChange,
}: {
  locations: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const chips = ["all", ...locations];
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((loc) => {
        const active = loc === value;
        return (
          <button
            key={loc}
            onClick={() => onChange(loc)}
            className={
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " +
              (active
                ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/15 dark:text-indigo-300"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800")
            }
          >
            {loc === "all" ? "All locations" : loc}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/filter-bar.tsx components/location-chips.tsx
git commit -m "feat: specialism filter bar + location chips"
```

---

### Task 8: Directory client (state wiring)

**Files:**
- Create: `components/directory.tsx`

**Interfaces:**
- Consumes: `Practitioner[]`, `filterPractitioners`, `uniqueSpecialisms`, `uniqueLocations`, `FilterBar`, `LocationChips`, `PractitionerList`.
- Produces: `Directory({ practitioners })` — `'use client'`; owns `specialism`/`location` state; renders filter bar, title+count, chips, list.

- [ ] **Step 1: `components/directory.tsx`**

```tsx
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

  const reset = () => { setSpecialism("all"); setLocation("all"); };

  return (
    <div className="flex flex-col gap-6">
      <FilterBar specialisms={specialisms} value={specialism} onChange={setSpecialism} onReset={reset} />
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Find an aesthetics trainer</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Showing {results.length} trainer{results.length === 1 ? "" : "s"}
        </p>
      </div>
      <LocationChips locations={locations} value={location} onChange={setLocation} />
      <PractitionerList practitioners={results} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/directory.tsx
git commit -m "feat: directory client wiring (filter state + derived options)"
```

---

### Task 9: Header + page + layout metadata

**Files:**
- Create: `components/header.tsx`
- Modify: `app/page.tsx` (replace boilerplate), `app/layout.tsx` (metadata)

**Interfaces:**
- Consumes: `getPractitioners`, `Directory`, `Header`.

- [ ] **Step 1: `components/header.tsx`**

```tsx
export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Aesthetic Training Hub</span>
        <span className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
          List your practice
        </span>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Replace `app/page.tsx`**

```tsx
import { getPractitioners } from "@/lib/practitioners";
import { Header } from "@/components/header";
import { Directory } from "@/components/directory";

// Uncached fetch (v16) + DB read — render at request time, don't prerender at build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const practitioners = await getPractitioners();
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Directory practitioners={practitioners} />
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Update `app/layout.tsx` metadata**

Replace the `metadata` export with:

```tsx
export const metadata: Metadata = {
  title: "Aesthetic Training Hub — Find a Trainer",
  description: "Browse vetted UK aesthetics trainers by specialism and location.",
};
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/layout.tsx components/header.tsx
git commit -m "feat: header, directory page, metadata"
```

---

### Task 10: README

**Files:**
- Modify: `README.md` (replace create-next-app boilerplate)

- [ ] **Step 1: Write README** covering (1) how to run, (2) progress report, (3) brief critique (from spec "Brief gaps"). Full content authored at this step from the spec.

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README — run, progress report, brief critique"
```

---

### Task 11: Verify

- [ ] **Step 1: Unit tests**

Run: `npm test`
Expected: PASS (6 tests).

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: compiles, type-checks, no errors.

- [ ] **Step 3: Run + manual check**

Run: `npm run dev`, open `http://localhost:3000`. Confirm: premium trainers first as gold Featured cards; no "Standard" text anywhere; Verified badge present on most, absent on the unverified seeds; specialism `<select>` filters; location chips filter; combined filters AND; reset clears; empty combo shows the no-match message.

---

## Self-Review

- **Spec coverage:** list page (T9) ✓; name/specialisms/location (T6) ✓; Featured-not-tier + Verified (T5/T6, copy rule) ✓; premium standout sort+elevation (T2 order, T6 style) ✓; specialism + location filters AND (T3/T7/T8) ✓; ~30 seed + verified mix (T4) ✓; profile picture + fallback (T5) ✓; drop Drizzle (T1) ✓; Supabase RLS (T2/T4) ✓; SpaceConnect visual language (T5–T9) ✓; README 3 parts (T10) ✓; force-dynamic for v16 uncached fetch (T9) ✓.
- **Placeholder scan:** README body is the only deferred content, authored in T10 from the spec's "Brief gaps" — not a placeholder in code.
- **Type consistency:** `Practitioner` fields used identically across T2–T9; `filterPractitioners`/`uniqueSpecialisms`/`uniqueLocations` signatures match T3 ↔ T8; `Badge` variant union matches T5 ↔ T6.
