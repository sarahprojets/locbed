-- Reference table so pricing/trial length can be updated by an admin
-- without a redeploy. Seeded in supabase/seed.sql; Stripe product/price
-- IDs are filled in by scripts/stripe-setup.ts once Stripe is connected.
create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  code public.listing_type not null unique,
  label text not null,
  stripe_product_id text,
  stripe_price_id text,
  amount_cents integer not null,
  currency text not null default 'eur',
  trial_days integer not null default 30,
  active boolean not null default true
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete set null,
  plan_id uuid not null references public.subscription_plans (id),
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  status public.subscription_status not null default 'trialing',
  trial_start timestamptz,
  trial_end timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_owner_idx on public.subscriptions (owner_id);

create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Idempotency log for the Stripe webhook handler. Service-role only —
-- never touched by client code or RLS-scoped queries.
create table public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  type text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.stripe_webhook_events enable row level security;

create policy "subscription_plans_public_read" on public.subscription_plans
  for select using (true);

create policy "subscription_plans_admin_write" on public.subscription_plans
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

create policy "subscriptions_owner_read" on public.subscriptions
  for select using (owner_id = auth.uid() or public.current_user_role() = 'admin');

-- No insert/update/delete policy for subscriptions or stripe_webhook_events:
-- both are written exclusively by the service-role client from the Stripe
-- webhook route (src/app/api/stripe/webhook/route.ts), which bypasses RLS.
