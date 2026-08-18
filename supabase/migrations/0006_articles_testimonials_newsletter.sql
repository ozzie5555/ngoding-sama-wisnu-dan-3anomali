-- ============================================================
-- Migration 0006: Articles, Testimonials
-- ============================================================

-- ============================================================
-- Table: articles
-- For the Insight section
-- ============================================================
create table public.articles (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text unique not null,
  content         text not null default '',
  excerpt         text not null default '',
  cover_path      text,
  category        text not null default 'artikel_edukasi'
                  check (category in (
                    'artikel_edukasi', 'hasil_riset', 'recycle_upcycle', 'berita_lingkungan'
                  )),
  author_name     text not null default '',
  author_avatar   text,
  is_published    boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.articles is 'Insight articles and educational content';

create index idx_articles_slug on public.articles (slug);
create index idx_articles_category on public.articles (category);
create index idx_articles_is_published on public.articles (is_published);
create index idx_articles_published_at on public.articles (published_at desc);

-- ============================================================
-- Trigger: Auto-update updated_at
-- ============================================================
create or replace trigger set_updated_at
  before update on public.articles
  for each row
  execute function public.handle_updated_at();

-- ============================================================
-- Table: testimonials
-- User reviews after donation is received
-- ============================================================
create table public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  donation_id   uuid not null references public.donations(id) on delete cascade,
  rating        integer not null check (rating >= 1 and rating <= 5),
  title         text not null default '',
  content       text not null,
  is_approved   boolean not null default false,
  approved_by   uuid references public.profiles(id) on delete set null,
  approved_at   timestamptz,
  created_at    timestamptz not null default now()
);

comment on table public.testimonials is 'User testimonials after donation received';

create index idx_testimonials_user_id on public.testimonials (user_id);
create index idx_testimonials_donation_id on public.testimonials (donation_id);
create index idx_testimonials_is_approved on public.testimonials (is_approved);

-- ============================================================
-- RPC: create_testimonial
-- Only allowed when donation status is 'received'
-- ============================================================
create or replace function public.create_testimonial(
  p_donation_id uuid,
  p_rating integer,
  p_title text default '',
  p_content text default ''
)
returns jsonb
language plpgsql
security definer set search_path = ''
as $$
declare
  v_user_id uuid;
  v_donation_status text;
  v_testimonial_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Check donation belongs to user and is received
  select status into v_donation_status
  from public.donations
  where id = p_donation_id and donor_id = v_user_id;

  if not found then
    raise exception 'Donation not found or not owned by you';
  end if;

  if v_donation_status != 'received' then
    raise exception 'Can only create testimonial after donation is received';
  end if;

  -- Check no existing testimonial for this donation
  if exists (
    select 1 from public.testimonials where donation_id = p_donation_id
  ) then
    raise exception 'Testimonial already exists for this donation';
  end if;

  -- Validate rating
  if p_rating < 1 or p_rating > 5 then
    raise exception 'Rating must be between 1 and 5';
  end if;

  insert into public.testimonials (user_id, donation_id, rating, title, content)
  values (v_user_id, p_donation_id, p_rating, p_title, p_content)
  returning id into v_testimonial_id;

  return jsonb_build_object(
    'id', v_testimonial_id,
    'is_approved', false,
    'message', 'Testimonial submitted, waiting for moderation'
  );
end;
$$;

-- ============================================================
-- RLS: articles
-- ============================================================
alter table public.articles enable row level security;

-- Public can read published articles
create policy "public read published articles"
  on public.articles for select
  using (is_published = true);

create policy "authenticated read articles"
  on public.articles for select
  to authenticated
  using (true);

-- Admin can manage all articles
create policy "admin manage articles"
  on public.articles for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- ============================================================
-- RLS: testimonials
-- ============================================================
alter table public.testimonials enable row level security;

-- Public can read approved testimonials
create policy "public read approved testimonials"
  on public.testimonials for select
  using (is_approved = true);

create policy "authenticated read testimonials"
  on public.testimonials for select
  to authenticated
  using (true);

-- User can insert own testimonial
create policy "user insert own testimonial"
  on public.testimonials for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Admin can moderate
create policy "admin moderate testimonials"
  on public.testimonials for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );
