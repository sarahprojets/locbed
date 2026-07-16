create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type public.report_target_type as enum ('listing', 'profile', 'review', 'message');

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type public.report_target_type not null,
  target_id uuid not null,
  reason text not null,
  details text,
  status public.report_status not null default 'open',
  resolved_by uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index reports_status_idx on public.reports (status);

alter table public.reports enable row level security;

create policy "reports_reporter_read" on public.reports
  for select using (reporter_id = auth.uid() or public.current_user_role() = 'admin');

create policy "reports_reporter_insert" on public.reports
  for insert with check (reporter_id = auth.uid());

create policy "reports_admin_update" on public.reports
  for update using (public.current_user_role() = 'admin');
