create table public.notification_preferences (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  preferences jsonb not null default '{
    "email": {"new_booking": true, "new_message": true, "new_review": true, "subscription_ending": true, "new_matching_listing": true},
    "push": {"new_booking": true, "new_message": true, "new_review": true, "subscription_ending": true, "new_matching_listing": true}
  }'::jsonb
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type text not null, -- new_booking | new_message | new_review | subscription_ending | new_matching_listing
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_profile_idx on public.notifications (profile_id, created_at desc);

alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;

create policy "notification_preferences_owner" on public.notification_preferences
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "notifications_owner_read" on public.notifications
  for select using (profile_id = auth.uid());

create policy "notifications_owner_mark_read" on public.notifications
  for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- No insert policy: notifications are created by triggers/service-role
-- (future automation), never directly by clients.
