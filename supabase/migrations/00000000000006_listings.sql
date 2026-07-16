create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  type public.listing_type not null,
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  country_id uuid references public.countries (id) on delete set null,
  city_id uuid references public.cities (id) on delete set null,
  address text,
  latitude double precision,
  longitude double precision,
  geog extensions.geography(point, 4326),
  max_guests integer not null default 1,
  bedrooms integer not null default 0,
  beds integer not null default 0,
  bathrooms integer not null default 0,
  base_price_per_night numeric(10, 2) not null default 0,
  currency text not null default 'EUR',
  status public.listing_status not null default 'draft',
  view_count integer not null default 0,
  favorite_count integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_geog_idx on public.listings using gist (geog);
create index listings_city_idx on public.listings (city_id);
create index listings_status_idx on public.listings (status);

create trigger set_updated_at before update on public.listings
  for each row execute function public.set_updated_at();

-- Keep geog in sync with lat/lng without requiring every write path to set it.
create or replace function public.sync_listing_geog()
returns trigger
language plpgsql
as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.geog = extensions.st_setsrid(extensions.st_makepoint(new.longitude, new.latitude), 4326);
  end if;
  return new;
end;
$$;

create trigger sync_geog before insert or update of latitude, longitude on public.listings
  for each row execute function public.sync_listing_geog();

create table public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text not null,
  position integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.listing_videos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text,
  url text,
  created_at timestamptz not null default now()
);

create table public.listing_amenities (
  listing_id uuid not null references public.listings (id) on delete cascade,
  amenity_id uuid not null references public.amenities (id) on delete cascade,
  primary key (listing_id, amenity_id)
);

-- Calendar skeleton. `source`/`external_uid` are deliberately here from day
-- one so iCal sync (Airbnb/Booking/Abritel) can be added later as a new
-- sync-job table + cron writing into this table, with no schema change.
create table public.listing_availability (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  date date not null,
  is_available boolean not null default true,
  price_override numeric(10, 2),
  source text not null default 'manual', -- manual | ical_airbnb | ical_booking | ical_abritel
  external_uid text,
  unique (listing_id, date)
);

alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.listing_videos enable row level security;
alter table public.listing_amenities enable row level security;
alter table public.listing_availability enable row level security;

create policy "listings_public_read_published" on public.listings
  for select using (
    status = 'published'
    or owner_id = auth.uid()
    or public.current_user_role() = 'admin'
  );

create policy "listings_owner_write" on public.listings
  for all using (owner_id = auth.uid() or public.current_user_role() = 'admin')
  with check (owner_id = auth.uid() or public.current_user_role() = 'admin');

create policy "listing_photos_read" on public.listing_photos
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'published' or l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );

create policy "listing_photos_owner_write" on public.listing_photos
  for all using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );

create policy "listing_videos_read" on public.listing_videos
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'published' or l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );

create policy "listing_videos_owner_write" on public.listing_videos
  for all using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );

create policy "listing_amenities_read" on public.listing_amenities
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'published' or l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );

create policy "listing_amenities_owner_write" on public.listing_amenities
  for all using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );

create policy "listing_availability_read" on public.listing_availability
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'published' or l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );

create policy "listing_availability_owner_write" on public.listing_availability
  for all using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and (l.owner_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );
