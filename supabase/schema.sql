-- InsightGuide schema (v2)
-- Run in Supabase SQL Editor

-- posts
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_created_idx on public.posts(status, created_at desc);
create index if not exists posts_category_idx on public.posts(category);

-- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  name text not null,
  description text not null default '',
  image_path text,
  affiliate_url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_post_id_idx on public.products(post_id);

-- updated_at trigger
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

-- RLS
alter table public.posts enable row level security;
alter table public.products enable row level security;

create policy "public reads published posts"
  on public.posts for select
  using (status = 'published');

create policy "public reads products of published posts"
  on public.products for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = products.post_id and p.status = 'published'
    )
  );

create policy "authenticated manages posts"
  on public.posts for all
  to authenticated
  using (true) with check (true);

create policy "authenticated manages products"
  on public.products for all
  to authenticated
  using (true) with check (true);

-- newsletter subscribers
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

-- Storage bucket "media" (public):
--  create via Dashboard: Storage > New bucket > media (Public)
--  then run:
--    create policy "public read media" on storage.objects for select using ( bucket_id = 'media' );
--    create policy "authenticated write media" on storage.objects for all
--      to authenticated using ( bucket_id = 'media' ) with check ( bucket_id = 'media' );

-- Optional featured post: add a column if not present
alter table public.posts add column if not exists featured boolean not null default false;
