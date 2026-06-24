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
- **Drop Drizzle:** commit `4b3a8a7` (Greg Peters) added a conflicting Drizzle
  integration. Per decision, remove it: `drizzle-orm`, `drizzle-kit`, `postgres`
  deps + `lib/db.ts`, `lib/schema.ts`, `scripts/seed.ts`. Supabase client covers
  DB access; two stacks is dead weight. Removal via a new (non-history-rewriting)
  commit.
- **No new dependencies.** Tailwind v4 already present. Native `<select>` for
  the specialism filter, plain buttons for location chips — no combobox library.
- **Route:** directory replaces the boilerplate landing at `/`.
- **Visual reference:** the "Office Space Finder / SpaceConnect" Dribbble shot
  (listing-page UI). Adopt its language, not its domain — see Visual design.

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
                        location). Derives filter options from the rows.
                        Filters in-memory, renders the listing rows.
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

## Visual design

Inspired by the SpaceConnect listing-page shot. Take its layout and palette,
map its domain (coworking spaces) onto ours (trainers).

**Palette / tokens**
- Primary: indigo-600 (`#4f46e5`) — wordmark, active chips, links, location pin,
  primary buttons.
- Warm accent: amber/gold — reserved for the **Premium** tier badge + premium
  card treatment (the shot uses orange for its category pill; we repurpose it for
  tier).
- Text: near-black headings, gray-500/600 body. Surfaces: white cards on a
  light gray (`zinc-50`) page, `gray-200` borders, rounded-xl, generous
  whitespace. Light + dark via Tailwind `dark:`.

**Page layout (single column, no lead-form sidebar — out of scope)**
1. **Header bar:** `Aesthetic Training Hub` wordmark (indigo) left; short tagline
   or a static "List your practice" pill (black, decorative) right. White, thin
   bottom border.
2. **Filter bar:** white rounded segmented bar mirroring the shot — a
   **Specialism** `<select>` (small uppercase label above value) + a **Reset
   filters** indigo link.
3. **Title + count:** `Find an aesthetics trainer` (large bold), then
   `Showing N trainers` (gray), updating live as filters change.
4. **Location chips:** horizontal row of pill buttons — `All`, then each UK
   location. Active chip = light indigo bg + indigo text (matches the shot's
   location chips). This is the location filter.
5. **Listing rows:** profile picture left, content right, divider between rows —
   the shot's row style, not heavy boxed cards (premium is the exception, below).

**Row content** (maps the shot's card): rounded portrait avatar (left) · name
(bold) + tier badge pill beside it · location with indigo pin icon · specialism
tags as light gray icon-chips (the shot's sqft/people/parking chip row).

## Premium standout

Premium rises out of the flat list, mirroring how the shot makes featured cards
pop — no setting toggle:

1. **Order:** premium sorted to the top.
2. **Elevation:** premium rows render as **bordered cards** with an amber/gold
   left accent, a subtle gold-tinted background, and soft shadow — lifted off the
   plain divider-separated standard rows below.
3. **Badge:** gold `★ Premium` pill beside the name. Standard tier shows a muted
   gray `Standard` pill (or none).

Works in light and dark (`dark:` variants).

**Avatar fallback:** picture renders from `profile_picture`; if null or it fails
to load, fall back to a neutral avatar showing the practitioner's initials. Plain
`<img>` with an `onError` handler (client component) — avoids `next/image`
`remotePatterns` config for the placeholder host.

## Filtering

- **Specialism:** native `<select>` in the filter bar, starts at "All". Options
  = unique specialisms flattened from every practitioner's `specialisms` array,
  sorted.
- **Location:** chip row, starts at "All". Options = unique locations from the
  rows, sorted.
- Filters combine with **AND**. A practitioner matches the specialism filter if
  the selected value is in its `specialisms` array.
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
