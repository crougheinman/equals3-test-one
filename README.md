# Aesthetic Training Hub — Practitioner Directory

Public directory for the Aesthetic Training Hub: vetted UK aesthetics trainers,
discoverable by prospective students, filterable by specialism and location.
Premium subscribers get prominence; vetted trainers carry a trust badge.

Built with Next.js 16 (App Router), React 19, Supabase (Postgres), Tailwind v4.

---

## 1. How to run

**Prerequisites:** Node 20+, a Supabase project.

1. **Environment** — `.env.local` (already present here) needs:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

2. **Database** — open the Supabase **SQL editor** and run [`supabase/seed.sql`](supabase/seed.sql).
   It creates the `practitioner_tier` enum, the `practitioners` table, a public
   read-only RLS policy, and inserts 30 seed trainers. (Re-running requires
   dropping the table/type first.)

3. **Install + run**
   ```bash
   npm install
   npm run dev        # http://localhost:3000
   ```

**Other scripts**
```bash
npm test           # vitest — filter/sort unit tests
npm run build      # production build + typecheck
```

---

## 2. Progress report

### Built
- **Directory page** (`/`) — server component fetches all practitioners from
  Supabase (anon client, premium-first then name), passes them to a client
  component that filters in-memory.
- **Filters** — specialism (`<select>`) + location (chips), combinable (AND),
  with a live result count and reset. No page reloads.
- **Premium prominence** — premium trainers sort to the top and render as
  elevated gold-accent cards with a `★ Featured` badge; standard trainers are
  plain rows. (See critique #1 for why it's "Featured", not "Standard".)
- **Verified badge** — `✓ Verified` trust signal, independent of tier.
- **30 seed trainers** across 10 UK cities and 9 specialisms, mixed tiers, a few
  unverified so the badge visibly varies. Portrait avatars with an initials
  fallback if an image is missing or fails to load.
- **Component architecture** — small single-purpose files under `components/`
  (`badge`, `avatar`, `specialism-tags`, `practitioner-card`, `practitioner-list`,
  `filter-bar`, `location-chips`, `directory`, `header`). Data access and pure
  filter/sort logic live in `lib/` (`supabase`, `practitioners`, `filter`,
  `types`), keeping queries and logic out of view components.
- **Tests** — vitest covers the filter (AND logic, array specialism match, empty
  result) and option-derivation helpers.

### Left out (deliberately — out of scope)
- Auth, trainer sign-up, subscription/billing.
- Trainer detail pages, an enquiry/contact action, free-text search, pagination.
- Sorting controls, map/distance filtering.
- A test runner for React components (only the pure logic is unit-tested; UI is
  covered by the production build + manual check).

### What I'd do next
1. **A conversion action** — the directory currently ends at "browse". Add a
   detail page or an enquiry form so discovery leads somewhere (see critique #6).
2. **Richer trainer data** — bio, accreditation body (JCCP / Save Face),
   experience, course dates/price, reviews (see critique #5).
3. **A defined ranking policy** with fair rotation among same-tier trainers
   (see critique #2).
4. **Scale the filtering** server-side (URL `searchParams`) if the dataset grows
   past a few hundred — currently fetch-once + client filter, ideal for dozens.
5. **Search** by name/specialism, and free-text location handling.

---

## 3. Where the brief was unclear or wrong

You asked for this directly, so — directly:

1. **Showing `tier` to students is a business mistake.** Tier is the *trainer's
   billing plan*, not a quality signal for students. Publicly labelling a trainer
   "Standard" tells students "this one pays you less" — which reads as "lesser",
   is unfair, and punishes the very trainer paying £150/mo to be seen. Premium
   should win through **placement and prominence** (the thing worth £249), not by
   branding everyone else second-class. **Changed it:** premium surfaces as
   **Featured**; the word "Standard" never appears. `tier` stays internal,
   driving ranking and the Featured badge.

2. **"Premium should stand out — how is your decision" hand-waves the core money
   mechanic.** The ranking rule *is* the product students pay for, yet the brief
   delegates it as a styling choice. It leaves undefined: does Premium always sit
   top? What happens when most trainers are Premium and the distinction collapses?
   With no rotation, the same Premium names sit top forever and the rest paid for
   nothing — a churn risk. This needs a stated ranking + fair-rotation policy, not
   CSS.

3. **You buried the trust signal and surfaced the wrong one.** "Vetted UK
   trainers" is the actual reason a student trusts this list — but the brief asks
   for no verified indicator while insisting on showing tier. Students care that
   someone is vetted, not which plan they bought. **Added** a `verified` field and
   a `✓ Verified` badge.

4. **"Filter by specialism *or* location (your choice)" understates the journey.**
   Real students filter by *what* a trainer teaches **and** *where* they are.
   "Either" suggests the search flow wasn't walked through. **Built both**,
   combinable.

5. **The fields are a schema, not a decision surface.** name + specialism +
   location + tier can't actually support "discover and choose a trainer." Missing
   what a student decides on: bio, accreditation (JCCP / Save Face — UK-specific),
   experience, course dates/price, reviews. The list looks complete but a student
   can't really choose from it.

6. **The funnel has no end.** The stated goal is trainers being "discovered by
   prospective students," but list + filter has no contact/enquiry or profile
   step. Discovery with no conversion action is half a product. What's the action?

7. **"Location" granularity is undefined** — city, region, travel radius, or
   online-vs-in-person all change the filter's meaning. Exact-string city
   matching is brittle (London vs Greater London vs Shoreditch). Used city
   strings for now; flagged for a real taxonomy.

### What I'd change about the spec/approach
- Treat tier as an **internal ranking input**, never student-facing copy.
- Make **Verified** (and ideally accreditation) the visible trust layer.
- Define the **ranking + rotation** policy explicitly — it's the monetisation.
- Expand the data model toward a real **decision surface** and add a **conversion
  action** so discovery converts.
