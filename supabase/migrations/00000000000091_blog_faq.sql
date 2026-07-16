create type public.blog_post_status as enum ('draft', 'published');

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles (id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_path text,
  audience text not null default 'both' check (audience in ('voyageur', 'proprietaire', 'both')),
  status public.blog_post_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  audience text not null default 'both' check (audience in ('voyageur', 'proprietaire', 'both')),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
alter table public.faq_items enable row level security;

create policy "blog_posts_public_read_published" on public.blog_posts
  for select using (status = 'published' or public.current_user_role() = 'admin');

create policy "blog_posts_admin_write" on public.blog_posts
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

create policy "faq_items_public_read" on public.faq_items
  for select using (true);

create policy "faq_items_admin_write" on public.faq_items
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');
