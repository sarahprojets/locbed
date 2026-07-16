-- Tables only in Phase 1 — no messaging UI/realtime wiring yet.
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings (id) on delete set null,
  traveler_id uuid not null references public.profiles (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (listing_id, traveler_id, owner_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index messages_conversation_idx on public.messages (conversation_id, created_at);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "conversations_participants_read" on public.conversations
  for select using (traveler_id = auth.uid() or owner_id = auth.uid());

create policy "conversations_participants_write" on public.conversations
  for all using (traveler_id = auth.uid() or owner_id = auth.uid())
  with check (traveler_id = auth.uid() or owner_id = auth.uid());

create policy "messages_participants_read" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.traveler_id = auth.uid() or c.owner_id = auth.uid())
    )
  );

create policy "messages_participants_insert" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.traveler_id = auth.uid() or c.owner_id = auth.uid())
    )
  );
