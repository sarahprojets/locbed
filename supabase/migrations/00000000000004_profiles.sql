create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'voyageur',
  display_name text,
  avatar_url text,
  phone text,
  bio text,
  locale text not null default 'fr',
  email_verified boolean not null default false,
  phone_verified boolean not null default false,
  identity_verification_status public.verification_status not null default 'unverified',
  identity_document_path text,
  selfie_path text,
  stripe_customer_id text unique,
  referral_code text not null unique default substr(md5(gen_random_uuid()::text), 1, 8),
  referred_by uuid references public.profiles (id) on delete set null,
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Public-safe view: never expose phone/email/ID documents to other users.
create view public.public_profiles
with (security_invoker = true) as
select
  id,
  display_name,
  avatar_url,
  bio,
  identity_verification_status,
  created_at
from public.profiles;

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.current_user_role() = 'admin');

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.current_user_role() = 'admin');

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create a profile row (default role: voyageur) whenever a new
-- auth.users row is inserted, carrying over a referral code from signup
-- metadata if the user signed up via a referral link.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  referrer_id uuid;
begin
  if new.raw_user_meta_data ? 'referral_code' then
    select id into referrer_id from public.profiles
      where referral_code = new.raw_user_meta_data ->> 'referral_code';
  end if;

  insert into public.profiles (id, display_name, referred_by)
  values (new.id, new.raw_user_meta_data ->> 'full_name', referrer_id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
