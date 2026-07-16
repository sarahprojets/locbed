create table public.countries (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- ISO 3166-1 alpha-2
  name text not null,
  slug text not null unique
);

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.countries (id) on delete cascade,
  name text not null,
  slug text not null,
  latitude double precision,
  longitude double precision,
  unique (country_id, slug)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  icon text
);

create table public.amenities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- pool, wifi, parking, air_conditioning, sea_view, pets_allowed, breakfast, remote_work_friendly, pmr_accessible...
  name text not null,
  icon text
);

alter table public.countries enable row level security;
alter table public.cities enable row level security;
alter table public.categories enable row level security;
alter table public.amenities enable row level security;

create policy "countries_public_read" on public.countries for select using (true);
create policy "cities_public_read" on public.cities for select using (true);
create policy "categories_public_read" on public.categories for select using (true);
create policy "amenities_public_read" on public.amenities for select using (true);

create policy "countries_admin_write" on public.countries for all
  using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy "cities_admin_write" on public.cities for all
  using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy "categories_admin_write" on public.categories for all
  using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy "amenities_admin_write" on public.amenities for all
  using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
