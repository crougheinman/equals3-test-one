# Practitioner Directory — Design

**Date:** 2026-06-25
**Product:** Aesthetic Training Hub — public practitioner directory
**Status:** Approved design, pre-implementation

## Goal

Public page listing vetted UK aesthetics trainers. Each entry shows name,
specialism(s), location, tier. Premium practitioners (£249/mo) visually stand
out from Standard (£150/mo). Students filter by specialism and location. Seeded
so the page is populated.

## Decisions

- **Data source:** Supabase (Postgres). `@supabase/supabase-js` already
  installed; creds present in `.env.local`
  (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **Filter:** both specialism and location, combinable (AND).
- **Filter mechanism:** fetch-once on the server, filter client-side. Dataset is
  small (dozens), so instant in-browser filtering beats per-change round-trips.
- **Drop Drizzle:** remove `drizzle-orm`, `drizzle-kit`, `postgres`,
  `lib/db.ts`, `lib/schema.ts`. Supabase client covers DB access; two stacks is
  dead weight.
- **No new dependencies.** Tailwind v4 already present. Native `<select>` for
  filters — no combobox library.
- **Route:** directory replaces the boilerplate landing at `/`.

## Data model

Postgres enum for tier:

```sql
create type practitioner_tier as enum ('standard', 'premium');
```

Supabase table `practitioners`:

| column          | type               | notes                              |
|-----------------|--------------------|------------------------------------|
| id              | bigint identity PK |                                    |
| name            | text not null      |                                    |
| specialisms     | text[] not null    | plural — a trainer teaches several |
| location        | text not null      | UK city / region                   |
| tier            | practitioner_tier not null | enum, not text+check       |
| profile_picture | text               | portrait image URL, nullable       |
| created_at      | timestamptz        | `default now()`                    |

**RLS:** enabled. Single policy: anon `SELECT` only. Public read-only directory;
no writes from the client.

## Architecture

```
app/page.tsx            Server Component. Fetches all practitioners via Supabase
                        anon client, ordered premium-first then name. Passes
                        rows to DirectoryClient.
app/directory-client.tsx  Client Component. Holds filter state (specialism,
                        location). Derives dropdown options from the rows.
                        Filters in-memory, renders the card grid.
lib/supabase.ts         Creates the Supabase client from the public env vars.
supabase/seed.sql       Table DDL + RLS policy + INSERTs. User runs it in the
                        Supabase SQL editor.
```

**Data flow:** request → server component queries Supabase (`select *`,
`.order('tier', { ascending: false })` — enum sorts by declaration order
(`standard`=1, `premium`=2), so descending puts premium first — then
`.order('name')`) → rows handed to client component →
user picks filters → client filters the array → grid re-renders. No further
network calls after first load.

## Premium standout

Three reinforcing signals, no setting toggle:

1. **Order:** premium sorted to the top of the grid.
2. **Badge:** `★ Premium` pill on premium cards.
3. **Card style:** premium gets a gold/amber accent border + subtle tinted
   background. Standard cards are plain (neutral border, white/zinc background).

Works in light and dark (Tailwind `dark:` variants).

**Card content (all tiers):** profile picture, name, location, specialism tags,
tier. Picture renders from `profile_picture`; if null or it fails to load, fall
back to a neutral avatar showing the practitioner's initials. Plain `<img>`
with an `onError` handler (client component) — avoids `next/image`
`remotePatterns` config for the placeholder host.

## Filtering

- Two native `<select>` controls: **Specialism**, **Location**. Each starts at
  "All".
- Options derived from the loaded rows (unique, sorted). Specialism options come
  from flattening every practitioner's `specialisms` array.
- Filters combine with AND. A practitioner matches a specialism filter if the
  selected value is in its `specialisms` array.
- Empty result → simple "No practitioners match" message.
- Premium-first order preserved within filtered results.

## Seed data

~30 practitioners in `supabase/seed.sql`. Mixed tiers (both Standard and Premium
well represented), varied UK locations (e.g. London, Manchester, Leeds, Glasgow,
Bristol, Birmingham, Edinburgh, Cardiff, Liverpool, Newcastle), varied
specialisms (e.g. Botox / Anti-wrinkle, Dermal Fillers, Skin Peels,
Microneedling, Lip Enhancement, PRP, Chemical Peels, Profhilo, Thread Lifts).
Many practitioners hold multiple specialisms to exercise the array filter.
Enough overlap in locations and specialisms that filters return multiple
results, not one-offs.

**Profile pictures:** seeded with portrait placeholder URLs from a free service
(e.g. `https://randomuser.me/api/portraits/...` or `https://i.pravatar.cc/...`),
deterministic per practitioner. No image upload or Supabase Storage.

## Out of scope (YAGNI)

- Auth / login, practitioner sign-up, subscription/billing flow.
- Practitioner detail pages, search box, pagination, sorting controls.
- Writes from the client, admin UI, image uploads.
- Drizzle migrations / config.

## Verification

- `npm run build` succeeds.
- Page renders the seeded practitioners, premium first and visually distinct.
- Specialism filter narrows to matching practitioners; location filter likewise;
  combined filters AND correctly; "All"/"All" shows everything.
- Empty-match combination shows the no-results message.

## Open dependency

`supabase/seed.sql` must be run by the user in the Supabase SQL editor before the
page shows data. Implementation note: this Next.js (16.2.9) may differ from
training data — read `node_modules/next/dist/docs/` for the current Server/Client
Component and data-fetching conventions before writing code (per AGENTS.md).
