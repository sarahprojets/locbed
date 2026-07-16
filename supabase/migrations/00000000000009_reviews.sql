-- Dual-purpose review table. `booking_request_id` is NOT NULL and must
-- reference an accepted booking — this is what enforces "reviews are
-- published only after a confirmed stay". `ratings` is jsonb because the
-- two review directions use different criteria sets (cleanliness/comfort/
-- communication/location/value for listing_review vs. respect/
-- communication/punctuality/cleanliness/rules for traveler_review).
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  type public.review_type not null,
  booking_request_id uuid not null references public.booking_requests (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete cascade,
  reviewee_id uuid references public.profiles (id) on delete cascade,
  ratings jsonb not null default '{}'::jsonb,
  rating_overall numeric(2, 1) not null,
  comment text,
  status public.review_status not null default 'pending',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint review_target_matches_type check (
    (type = 'listing_review' and listing_id is not null and reviewee_id is null)
    or (type = 'traveler_review' and reviewee_id is not null and listing_id is null)
  )
);

create index reviews_listing_idx on public.reviews (listing_id) where listing_id is not null;
create index reviews_reviewee_idx on public.reviews (reviewee_id) where reviewee_id is not null;

create trigger set_updated_at before update on public.reviews
  for each row execute function public.set_updated_at();

create table public.review_photos (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews (id) on delete cascade,
  storage_path text not null,
  position integer not null default 0
);

alter table public.reviews enable row level security;
alter table public.review_photos enable row level security;

create policy "reviews_public_read_published" on public.reviews
  for select using (
    status = 'published'
    or reviewer_id = auth.uid()
    or reviewee_id = auth.uid()
    or public.current_user_role() = 'admin'
  );

-- The reviewer must be a party (traveler or listing owner) to the accepted
-- booking they're reviewing — enforced via the subquery, not just app logic.
create policy "reviews_reviewer_insert" on public.reviews
  for insert with check (
    reviewer_id = auth.uid()
    and exists (
      select 1 from public.booking_requests br
      join public.listings l on l.id = br.listing_id
      where br.id = booking_request_id
        and br.status = 'accepted'
        and (br.traveler_id = auth.uid() or l.owner_id = auth.uid())
    )
  );

create policy "reviews_admin_moderate" on public.reviews
  for update using (public.current_user_role() = 'admin');

create policy "review_photos_read" on public.review_photos
  for select using (
    exists (
      select 1 from public.reviews r
      where r.id = review_id
        and (r.status = 'published' or r.reviewer_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );

create policy "review_photos_reviewer_write" on public.review_photos
  for all using (
    exists (select 1 from public.reviews r where r.id = review_id and r.reviewer_id = auth.uid())
  )
  with check (
    exists (select 1 from public.reviews r where r.id = review_id and r.reviewer_id = auth.uid())
  );
