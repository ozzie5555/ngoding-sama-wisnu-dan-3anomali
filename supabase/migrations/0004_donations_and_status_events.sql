-- ============================================================
-- Migration 0004: Donations and Status Events
-- ============================================================

-- ============================================================
-- Table: donations
-- ============================================================
create table public.donations (
  id               uuid primary key default gen_random_uuid(),
  donation_code    text unique not null,
  donor_id         uuid not null references public.profiles(id) on delete restrict,
  community_id     uuid not null references public.communities(id) on delete restrict,
  need_id          uuid references public.community_needs(id) on delete set null,
  category         text not null
                   check (category in ('barang_bekas', 'pakaian_layak', 'buku_atk', 'karya_daur_ulang')),
  item_name        text not null,
  condition_note   text not null default '',
  quantity         integer not null default 1 check (quantity > 0),
  description      text not null default '',
  pickup_address   text not null,
  pickup_at        timestamptz,
  status           text not null default 'pending'
                   check (status in ('pending', 'verified', 'in_transit', 'received', 'cancelled')),
  submitted_at     timestamptz not null default now(),
  received_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.donations is 'Donation records with status tracking';

create index idx_donations_donor_id on public.donations (donor_id);
create index idx_donations_community_id on public.donations (community_id);
create index idx_donations_need_id on public.donations (need_id);
create index idx_donations_donation_code on public.donations (donation_code);
create index idx_donations_status on public.donations (status);
create index idx_donations_category on public.donations (category);
create index idx_donations_submitted_at on public.donations (submitted_at);

-- ============================================================
-- Table: donation_items
-- Photos attached to donations
-- ============================================================
create table public.donation_items (
  id            uuid primary key default gen_random_uuid(),
  donation_id   uuid not null references public.donations(id) on delete cascade,
  storage_path  text not null,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

comment on table public.donation_items is 'Photo files attached to donations';

create index idx_donation_items_donation_id on public.donation_items (donation_id);

-- ============================================================
-- Table: donation_status_events
-- Timeline of status changes (audit trail)
-- ============================================================
create table public.donation_status_events (
  id            uuid primary key default gen_random_uuid(),
  donation_id   uuid not null references public.donations(id) on delete cascade,
  from_status   text,
  to_status     text not null,
  note          text not null default '',
  changed_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);

comment on table public.donation_status_events is 'Audit trail of donation status changes';

create index idx_donation_status_events_donation_id on public.donation_status_events (donation_id);
create index idx_donation_status_events_changed_by on public.donation_status_events (changed_by);

-- ============================================================
-- Trigger: Auto-update updated_at
-- ============================================================
create or replace trigger set_updated_at
  before update on public.donations
  for each row
  execute function public.handle_updated_at();

-- ============================================================
-- RPCs (submit_donation & transition_donation_status)
-- are defined in migration 0005 after notifications table
-- ============================================================

-- ============================================================
-- RLS: donations
-- ============================================================
alter table public.donations enable row level security;

-- Donor can read their own donations
create policy "donor read own donations"
  on public.donations for select
  to authenticated
  using ((select auth.uid()) = donor_id);

-- Community manager can read donations for their community
create policy "manager read community donations"
  on public.donations for select
  to authenticated
  using (
    exists (
      select 1 from public.communities
      where id = donations.community_id and manager_id = (select auth.uid())
    )
  );

-- Admin can read all donations
create policy "admin read all donations"
  on public.donations for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- Authenticated user can insert their own donation
create policy "user insert own donation"
  on public.donations for insert
  to authenticated
  with check ((select auth.uid()) = donor_id);

-- ============================================================
-- RLS: donation_items
-- ============================================================
alter table public.donation_items enable row level security;

create policy "donor read own donation items"
  on public.donation_items for select
  to authenticated
  using (
    exists (
      select 1 from public.donations
      where id = donation_items.donation_id and donor_id = (select auth.uid())
    )
  );

create policy "donor insert own donation items"
  on public.donation_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.donations
      where id = donation_items.donation_id and donor_id = (select auth.uid())
    )
  );

-- ============================================================
-- RLS: donation_status_events
-- ============================================================
alter table public.donation_status_events enable row level security;

create policy "donor read own events"
  on public.donation_status_events for select
  to authenticated
  using (
    exists (
      select 1 from public.donations
      where id = donation_status_events.donation_id and donor_id = (select auth.uid())
    )
  );

create policy "manager read community events"
  on public.donation_status_events for select
  to authenticated
  using (
    exists (
      select 1 from public.donations d
      join public.communities c on c.id = d.community_id
      where d.id = donation_status_events.donation_id and c.manager_id = (select auth.uid())
    )
  );

create policy "admin read all events"
  on public.donation_status_events for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "authorized insert events"
  on public.donation_status_events for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role in ('admin', 'manager')
    )
  );
