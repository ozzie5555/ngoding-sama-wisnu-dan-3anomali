-- ============================================================
-- Migration 0003: Communities and Needs
-- ============================================================

-- ============================================================
-- Table: communities
-- ============================================================
create table public.communities (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text unique not null,
  description     text not null default '',
  location        text not null default '',
  address         text,
  logo_path       text,
  social_links    jsonb not null default '{
    "instagram": null,
    "facebook": null,
    "twitter": null,
    "tiktok": null,
    "youtube": null,
    "website": null
  }'::jsonb,
  manager_id      uuid references public.profiles(id) on delete set null,
  is_verified     boolean not null default false,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.communities is 'Verified communities that receive donations';

create index idx_communities_slug on public.communities (slug);
create index idx_communities_manager_id on public.communities (manager_id);
create index idx_communities_is_verified on public.communities (is_verified);
create index idx_communities_is_active on public.communities (is_active);
create index idx_communities_location on public.communities (location);

-- ============================================================
-- Table: community_needs
-- What each community currently needs
-- ============================================================
create table public.community_needs (
  id                uuid primary key default gen_random_uuid(),
  community_id      uuid not null references public.communities(id) on delete cascade,
  category          text not null
                    check (category in ('barang_bekas', 'pakaian_layak', 'buku_atk', 'karya_daur_ulang')),
  item_name         text not null,
  description       text not null default '',
  quantity_needed   integer not null default 1 check (quantity_needed > 0),
  quantity_received integer not null default 0 check (quantity_received >= 0),
  status            text not null default 'open'
                    check (status in ('open', 'fulfilled', 'archived')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.community_needs is 'Specific item needs from each community';

create index idx_community_needs_community_id on public.community_needs (community_id);
create index idx_community_needs_category on public.community_needs (category);
create index idx_community_needs_status on public.community_needs (status);

-- ============================================================
-- Table: donation_channels
-- Alternative donation methods for each community
-- ============================================================
create table public.donation_channels (
  id              uuid primary key default gen_random_uuid(),
  community_id    uuid not null references public.communities(id) on delete cascade,
  channel_type    text not null
                  check (channel_type in ('bank_transfer', 'drop_point', 'address', 'contact', 'other')),
  label           text not null,
  details         text not null,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.donation_channels is 'Alternative donation channels (bank, drop point, etc.)';

create index idx_donation_channels_community_id on public.donation_channels (community_id);

-- ============================================================
-- Trigger: Auto-update updated_at
-- ============================================================
create or replace trigger set_updated_at
  before update on public.communities
  for each row
  execute function public.handle_updated_at();

create or replace trigger set_updated_at
  before update on public.community_needs
  for each row
  execute function public.handle_updated_at();

create or replace trigger set_updated_at
  before update on public.donation_channels
  for each row
  execute function public.handle_updated_at();

-- ============================================================
-- Constraint: quantity_received <= quantity_needed
-- ============================================================
alter table public.community_needs
  add constraint check_quantity_not_exceed
  check (quantity_received <= quantity_needed);

-- ============================================================
-- RLS: communities
-- ============================================================
alter table public.communities enable row level security;

-- Guest/public can read verified and active communities
create policy "public read verified active communities"
  on public.communities for select
  using (is_verified = true and is_active = true);

-- Authenticated users can read same
create policy "authenticated read communities"
  on public.communities for select
  to authenticated
  using (true);

-- Manager can update their own community
create policy "manager update own community"
  on public.communities for update
  to authenticated
  using ((select auth.uid()) = manager_id)
  with check ((select auth.uid()) = manager_id);

-- Admin can do everything
create policy "admin full access communities"
  on public.communities for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- ============================================================
-- RLS: community_needs
-- ============================================================
alter table public.community_needs enable row level security;

create policy "public read open needs"
  on public.community_needs for select
  using (status = 'open');

create policy "authenticated read needs"
  on public.community_needs for select
  to authenticated
  using (true);

create policy "manager manage own community needs"
  on public.community_needs for all
  to authenticated
  using (
    exists (
      select 1 from public.communities
      where id = community_needs.community_id and manager_id = (select auth.uid())
    )
  );

create policy "admin full access needs"
  on public.community_needs for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- ============================================================
-- RLS: donation_channels
-- ============================================================
alter table public.donation_channels enable row level security;

create policy "public read active channels"
  on public.donation_channels for select
  using (is_active = true);

create policy "authenticated read channels"
  on public.donation_channels for select
  to authenticated
  using (true);

create policy "manager manage own channels"
  on public.donation_channels for all
  to authenticated
  using (
    exists (
      select 1 from public.communities
      where id = donation_channels.community_id and manager_id = (select auth.uid())
    )
  );

create policy "admin full access channels"
  on public.donation_channels for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );
