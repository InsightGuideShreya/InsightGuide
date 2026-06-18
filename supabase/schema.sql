-- =====================================================================
-- InsightGuide schema (v3)
-- Last updated: 2026
--
-- This file mirrors the current code. It is **idempotent**:
--   - CREATE statements use IF NOT EXISTS
--   - ALTER statements use ADD/DROP COLUMN IF EXISTS
--   - Policies use CREATE POLICY only the first time; re-runs will error
--     with "policy already exists" — that is fine.
--
-- Strategy:
--   1. Run this whole file once in Supabase > SQL Editor
--   2. Add the storage bucket + storage policies (last section)
--   3. (Optional) drop the now-unused posts columns to slim the schema
-- =====================================================================


-- ---------------------------------------------------------------
-- posts
-- Used columns: id, slug, headline, cover_image_path, category,
-- status, author_id, created_at, updated_at.
-- Legacy columns (excerpt, description, verdict, rating, featured)
-- are kept below with `add column if not exists` so existing rows
-- still load. The UI no longer reads them. They can be dropped
-- safely (see the "Optional cleanup" section at the bottom).
-- ---------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  headline text not null,
  excerpt text not null default '',
  description text not null default '',
  cover_image_path text,
  category text not null default 'Reviews',
  verdict text,
  rating numeric(3,1),
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references auth.users(id) on delete set null,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backfill any column that the canonical CREATE above may have
-- pre-existed without (when this file is run against an older DB).
alter table public.posts add column if not exists excerpt text not null default '';
alter table public.posts add column if not exists description text not null default '';
alter table public.posts add column if not exists verdict text;
alter table public.posts add column if not exists rating numeric(3,1);
alter table public.posts add column if not exists featured boolean not null default false;
alter table public.posts add column if not exists cover_image_path text;
alter table public.posts add column if not exists category text not null default 'Reviews';
alter table public.posts add column if not exists author_id uuid references auth.users(id) on delete set null;

create index if not exists posts_status_created_idx on public.posts(status, created_at desc);
create index if not exists posts_category_idx on public.posts(category);


-- ---------------------------------------------------------------
-- products
-- Used columns: id, post_id, name, description, image_path,
-- affiliate_url, rating, position, created_at.
-- ---------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  name text not null,
  description text not null default '',
  image_path text,
  affiliate_url text not null,
  rating numeric(3,1),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products add column if not exists rating numeric(3,1);
create index if not exists products_post_id_idx on public.products(post_id);


-- ---------------------------------------------------------------
-- updated_at trigger for posts
-- ---------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------
alter table public.posts enable row level security;
alter table public.products enable row level security;

-- Public can read only PUBLISHED posts
create policy "public reads published posts"
  on public.posts for select
  using (status = 'published');

-- Public can read products whose parent post is PUBLISHED
create policy "public reads products of published posts"
  on public.products for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = products.post_id and p.status = 'published'
    )
  );

-- Authenticated users (admins) can do everything on posts and products
create policy "authenticated manages posts"
  on public.posts for all
  to authenticated
  using (true) with check (true);

create policy "authenticated manages products"
  on public.products for all
  to authenticated
  using (true) with check (true);


-- ---------------------------------------------------------------
-- newsletter subscribers
-- Public can INSERT (the form posts there). Authenticated admins
-- can SELECT (to view subscribers in /admin/subscribers).
-- ---------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "authenticated reads subscribers"
  on public.newsletter_subscribers for select
  to authenticated
  using (true);


-- =====================================================================
-- Storage bucket "media" (public)
-- =====================================================================
--
-- The bucket must be created via the Dashboard (Storage > New bucket):
--   - Name: media
--   - Public bucket: ON
--
-- Then add these two policies in the SQL Editor (this file's storage
-- block is the canonical place for them):

create policy "public read media"
  on storage.objects for select
  using ( bucket_id = 'media' );

create policy "authenticated write media"
  on storage.objects for all
  to authenticated
  using ( bucket_id = 'media' )
  with check ( bucket_id = 'media' );

-- If you've already created the policies once and re-run this file,
-- you'll see "policy already exists". That's fine — ignore it.


-- =====================================================================
-- Optional cleanup: drop post columns that the UI no longer reads
-- =====================================================================
--
-- Run this block SEPARATELY after you've re-saved all posts (so any
-- stored data you still care about has moved out). It frees schema
-- space and removes the temptation to read them by accident.
--
--   alter table public.posts
--     drop column if exists excerpt,
--     drop column if exists description,
--     drop column if exists verdict,
--     drop column if exists rating,
--     drop column if exists featured;
