-- Covers booking requests, the waitlist, and price offers/counter-offers
-- in one table (they're all the same negotiation flow between a traveler
-- and an owner over a date range).
create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  traveler_id uuid not null references public.profiles (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  guests_count integer not null default 1,
  message text,
  proposed_price numeric(10, 2),
  counter_price numeric(10, 2),
  status public.booking_request_status not null default 'pending',
  owner_response_message text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_dates_valid check (end_date > start_date)
);

create index booking_requests_listing_idx on public.booking_requests (listing_id);
create index booking_requests_traveler_idx on public.booking_requests (traveler_id);

create trigger set_updated_at before update on public.booking_requests
  for each row execute function public.set_updated_at();

alter table public.booking_requests enable row level security;

create policy "booking_requests_parties_read" on public.booking_requests
  for select using (
    traveler_id = auth.uid()
    or public.current_user_role() = 'admin'
    or exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  );

create policy "booking_requests_traveler_insert" on public.booking_requests
  for insert with check (traveler_id = auth.uid());

-- Status transitions: the listing owner accepts/refuses/counters, the
-- traveler cancels, admin can moderate. Enforcing exactly which transitions
-- each party may perform is application logic, not RLS.
create policy "booking_requests_parties_update" on public.booking_requests
  for update using (
    traveler_id = auth.uid()
    or public.current_user_role() = 'admin'
    or exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  );
