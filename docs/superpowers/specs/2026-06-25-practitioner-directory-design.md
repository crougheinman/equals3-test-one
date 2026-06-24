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

Supabase table `practitioners`:

| column      | type               | notes                                  |
|-------------|--------------------|----------------------------------------|
| id          | bigint identity PK |                                        |
| name        | text not null      |                                        |
| specialisms | text[] not null    | plural — a trainer teaches several      |
| location    | text not null      | UK city / region                       |
| tier        | text not null      | `check (tier in ('standard','premium'))` |
| created_at  | timestamptz        | `default now()`                        |

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
`.order('tier', { ascending: false })` so `premium` > `standard` alphabetically
puts premium first, then `.order('name')`) → rows handed to client component →
user picks filters → client filters the array → grid re-renders. No further
network calls after first load.

## Premium standout

Three reinforcing signals, no setting toggle:

1. **Order:** premium sorted to the top of the grid.
2. **Badge:** `★ Premium` pill on premium cards.
3. **Card style:** premium gets a gold/amber accent border + subtle tinted
   background. Standard cards are plain (neutral border, white/zinc background).

Works in light and dark (Tailwind `dark:` variants).

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

8–10 practitioners in `supabase/seed.sql`. Mixed tiers (both Standard and
Premium represented), varied UK locations (e.g. London, Manchester, Leeds,
Glasgow, Bristol), varied specialisms (e.g. Botox / Anti-wrinkle, Dermal
Fillers, Skin Peels, Microneedling, Lip Enhancement, PRP). Some practitioners
hold multiple specialisms to exercise the array filter.

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
