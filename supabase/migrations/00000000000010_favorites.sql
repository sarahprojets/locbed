create table public.favorites (
  traveler_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (traveler_id, listing_id)
);

alter table public.favorites enable row level security;

create policy "favorites_owner_read" on public.favorites
  for select using (traveler_id = auth.uid());

create policy "favorites_owner_write" on public.favorites
  for all using (traveler_id = auth.uid()) with check (traveler_id = auth.uid());
