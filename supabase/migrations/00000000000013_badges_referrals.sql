create table public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- super_proprietaire | voyageur_exemplaire | reponse_rapide | profil_verifie | coup_de_coeur | nouveau_logement
  name text not null,
  icon text,
  scope text not null check (scope in ('profile', 'listing'))
);

create table public.profile_badges (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (profile_id, badge_id)
);

create table public.listing_badges (
  listing_id uuid not null references public.listings (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (listing_id, badge_id)
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles (id) on delete cascade,
  referee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'rewarded')),
  reward_granted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (referee_id)
);

alter table public.badges enable row level security;
alter table public.profile_badges enable row level security;
alter table public.listing_badges enable row level security;
alter table public.referrals enable row level security;

create policy "badges_public_read" on public.badges for select using (true);
create policy "badges_admin_write" on public.badges for all
  using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "profile_badges_read" on public.profile_badges
  for select using (profile_id = auth.uid() or public.current_user_role() = 'admin');

create policy "listing_badges_read" on public.listing_badges
  for select using (
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
    or public.current_user_role() = 'admin'
  );

create policy "referrals_parties_read" on public.referrals
  for select using (
    referrer_id = auth.uid() or referee_id = auth.uid() or public.current_user_role() = 'admin'
  );

-- profile_badges/listing_badges/referrals writes: service-role only for
-- now (awarding automation is a later iteration), no client write policy.
