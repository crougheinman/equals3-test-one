-- Aesthetic Training Hub — practitioner directory schema + seed.
-- Run in the Supabase SQL editor.
--
-- WARNING: this DROPS and recreates the `equals` table. Safe if it is empty /
-- a placeholder (as it was at build time). If you have real data in `equals`,
-- back it up first.

drop table if exists equals cascade;
drop type if exists practitioner_tier cascade;

create type practitioner_tier as enum ('standard', 'premium');

create table equals (
  id bigint generated always as identity primary key,
  name text not null,
  specialisms text[] not null,
  location text not null,
  tier practitioner_tier not null,
  verified boolean not null default true,
  profile_picture text,
  created_at timestamptz not null default now()
);

alter table equals enable row level security;

create policy "Public can read equals"
  on equals for select
  to anon
  using (true);

insert into equals (name, specialisms, location, tier, verified, profile_picture) values
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
