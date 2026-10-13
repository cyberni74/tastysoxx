-- Three departments (socken, slips, bhs) with sub-categories, new attributes, abuse reports

alter table public.listings drop constraint if exists listings_category_check;
alter table public.listings add constraint listings_category_check check (category in (
  'sneaker','sport','knie','nylon','strumpfhose',   -- socken
  'slip','string','hipster',                         -- slips
  'bh','sport-bh','bralette'));                      -- bhs

alter table public.listings add column department text generated always as (
  case
    when category in ('slip','string','hipster') then 'slips'
    when category in ('bh','sport-bh','bralette') then 'bhs'
    else 'socken'
  end) stored;
create index listings_dept_idx on public.listings (department, status, created_at desc);

alter table public.listings drop constraint if exists listings_material_check;
alter table public.listings add constraint listings_material_check check (material in (
  'Baumwolle','Wolle','Nylon','Synthetik','Spitze','Seide','Mikrofaser'));

alter table public.listings add column size text not null default '' check (char_length(size) <= 12);
alter table public.listings add column color text not null default '' check (color in (
  '','schwarz','weiss','grau','beige','rosa','rot','blau','gruen','lila','bunt'));
alter table public.listings add column condition text not null default 'normal' check (condition in ('leicht','normal','intensiv'));

-- REPORTS (Meldeweg) -------------------------------------------------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  listing_id uuid references public.listings(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  reason text not null check (reason in ('minderjaehrig','illegal','betrug','belaestigung','falsche_angaben','sonstiges')),
  details text not null default '' check (char_length(details) <= 1000),
  contact_email text check (contact_email is null or char_length(contact_email) <= 200),
  status text not null default 'open' check (status in ('open','reviewed','closed')),
  created_at timestamptz not null default now(),
  check (listing_id is not null or profile_id is not null)
);
alter table public.reports enable row level security;
-- anyone (also signed-out) may file a report; reporter_id must be themselves or null
create policy "file report" on public.reports for insert to anon, authenticated
  with check (reporter_id is null or reporter_id = auth.uid());
create policy "admins read reports" on public.reports for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
create policy "admins update reports" on public.reports for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
