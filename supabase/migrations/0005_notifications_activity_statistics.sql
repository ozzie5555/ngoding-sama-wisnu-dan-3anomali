-- ============================================================
-- Migration 0005: Notifications, Activity Feed, Impact Statistics
-- ============================================================

-- ============================================================
-- Table: notifications
-- ============================================================
create table public.notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  body          text not null default '',
  type          text not null default 'general'
                check (type in ('general', 'donation_update', 'community_news', 'system', 'chat')),
  reference_id  uuid,
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

comment on table public.notifications is 'Per-user notifications';

create index idx_notifications_user_id on public.notifications (user_id);
create index idx_notifications_is_read on public.notifications (is_read);
create index idx_notifications_created_at on public.notifications (created_at desc);

-- ============================================================
-- Table: activity_feed
-- Public-facing sanitized activity log
-- ============================================================
create table public.activity_feed (
  id            uuid primary key default gen_random_uuid(),
  actor_id      uuid references public.profiles(id) on delete set null,
  action_type   text not null
                check (action_type in ('donation_submitted', 'donation_received', 'testimonial', 'community_joined')),
  title         text not null,
  description   text not null default '',
  metadata      jsonb not null default '{}'::jsonb,
  is_public     boolean not null default true,
  created_at    timestamptz not null default now()
);

comment on table activity_feed is 'Public-facing sanitized activity log';

create index idx_activity_feed_created_at on public.activity_feed (created_at desc);
create index idx_activity_feed_action_type on public.activity_feed (action_type);
create index idx_activity_feed_is_public on public.activity_feed (is_public);

-- ============================================================
-- Table: impact_statistics
-- Global stats for homepage display
-- ============================================================
create table public.impact_statistics (
  id              uuid primary key default gen_random_uuid(),
  stat_key        text unique not null,
  stat_value      bigint not null default 0,
  stat_label      text not null,
  stat_unit       text not null default '',
  updated_at      timestamptz not null default now()
);

comment on table public.impact_statistics is 'Global impact numbers for homepage';

-- Seed initial stats
insert into public.impact_statistics (stat_key, stat_value, stat_label, stat_unit) values
  ('items_circulated', 12400, 'Barang Tersirkulasi', '+'),
  ('waste_reduced', 2000, 'Sampah Dikurangi', ' kg'),
  ('co2_saved', 4680, 'CO₂ Dihemat', ' kg'),
  ('active_users', 1500, 'Pengguna Aktif', '+');

-- ============================================================
-- Table: newsletter_subscribers
-- ============================================================
create table public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  unsubscribed_at timestamptz
);

comment on table public.newsletter_subscribers is 'Newsletter email subscribers';

create index idx_newsletter_email on public.newsletter_subscribers (email);

-- ============================================================
-- RPC: increment_stat
-- Safe increment for impact statistics
-- ============================================================
create or replace function public.increment_stat(p_stat_key text, p_increment bigint default 1)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.impact_statistics
  set stat_value = stat_value + p_increment,
      updated_at = now()
  where stat_key = p_stat_key;
end;
$$;

-- ============================================================
-- RPC: submit_donation
-- Single transaction to create donation + initial status event
-- ============================================================
create or replace function public.submit_donation(payload jsonb)
returns jsonb
language plpgsql
security definer set search_path = ''
as $$
declare
  v_user_id uuid;
  v_community_id uuid;
  v_need_id uuid;
  v_donation_id uuid;
  v_donation_code text;
  v_community_active boolean;
  v_community_verified boolean;
  v_category text;
  v_quantity integer;
  v_result jsonb;
begin
  -- 1. Ensure user is authenticated
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- 2. Validate community exists, is active and verified
  v_community_id := (payload ->> 'community_id')::uuid;
  select is_active, is_verified into v_community_active, v_community_verified
  from public.communities
  where id = v_community_id;

  if not found then
    raise exception 'Community not found';
  end if;
  if not v_community_active then
    raise exception 'Community is not active';
  end if;
  if not v_community_verified then
    raise exception 'Community is not verified';
  end if;

  -- 3. Validate category
  v_category := payload ->> 'category';
  if v_category not in ('barang_bekas', 'pakaian_layak', 'buku_atk', 'karya_daur_ulang') then
    raise exception 'Invalid category: %', v_category;
  end if;

  -- 4. Validate quantity
  v_quantity := (payload ->> 'quantity')::int;
  if v_quantity is null or v_quantity <= 0 then
    raise exception 'Quantity must be greater than 0';
  end if;

  -- 5. Validate need if provided
  v_need_id := nullif(payload ->> 'need_id', '')::uuid;
  if v_need_id is not null then
    if not exists (
      select 1 from public.community_needs
      where id = v_need_id and community_id = v_community_id and status = 'open'
    ) then
      raise exception 'Need not found or not open';
    end if;
  end if;

  -- 6. Generate donation code
  v_donation_code := public.generate_donation_code();

  -- 7. Insert donation
  insert into public.donations (
    donation_code, donor_id, community_id, need_id,
    category, item_name, condition_note, quantity,
    description, pickup_address, pickup_at, status
  ) values (
    v_donation_code,
    v_user_id,
    v_community_id,
    v_need_id,
    v_category,
    payload ->> 'item_name',
    coalesce(payload ->> 'condition_note', ''),
    v_quantity,
    coalesce(payload ->> 'description', ''),
    payload ->> 'pickup_address',
    nullif(payload ->> 'pickup_at', '')::timestamptz,
    'pending'
  ) returning id into v_donation_id;

  -- 8. Insert initial status event
  insert into public.donation_status_events (
    donation_id, from_status, to_status, note, changed_by
  ) values (
    v_donation_id, null, 'pending', 'Donation submitted', v_user_id
  );

  -- 9. Create notification for the donor
  insert into public.notifications (
    user_id, title, body, type, reference_id
  ) values (
    v_user_id,
    'Donasi berhasil diajukan',
    'Donasi dengan kode ' || v_donation_code || ' sedang menunggu verifikasi.',
    'donation_update',
    v_donation_id
  );

  -- 10. Return result
  v_result := jsonb_build_object(
    'id', v_donation_id,
    'donation_code', v_donation_code,
    'status', 'pending'
  );

  return v_result;
end;
$$;

-- ============================================================
-- RPC: transition_donation_status
-- For admin/manager to change donation status
-- ============================================================
create or replace function public.transition_donation_status(
  p_donation_id uuid,
  p_next_status text,
  p_note text default ''
)
returns jsonb
language plpgsql
security definer set search_path = ''
as $$
declare
  v_user_id uuid;
  v_user_role text;
  v_current_status text;
  v_community_id uuid;
  v_community_manager uuid;
  v_donation_code text;
  v_donor_id uuid;
  v_valid boolean := false;
  v_result jsonb;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Get user role
  select role into v_user_role from public.profiles where id = v_user_id;

  -- Get current donation state
  select status, community_id, donation_code, donor_id
  into v_current_status, v_community_id, v_donation_code, v_donor_id
  from public.donations
  where id = p_donation_id;

  if not found then
    raise exception 'Donation not found';
  end if;

  -- Get community manager
  select manager_id into v_community_manager
  from public.communities
  where id = v_community_id;

  -- Check authorization: admin or community manager
  if v_user_role != 'admin' and v_community_manager != v_user_id then
    raise exception 'Not authorized to transition this donation';
  end if;

  -- Validate transition rules
  v_valid := case
    when v_current_status = 'pending' and p_next_status = 'verified' then true
    when v_current_status = 'verified' and p_next_status = 'in_transit' then true
    when v_current_status = 'in_transit' and p_next_status = 'received' then true
    when v_current_status in ('pending', 'verified') and p_next_status = 'cancelled' then true
    else false
  end;

  if not v_valid then
    raise exception 'Invalid transition from % to %', v_current_status, p_next_status;
  end if;

  -- Update donation status
  update public.donations
  set status = p_next_status,
      received_at = case when p_next_status = 'received' then now() else received_at end
  where id = p_donation_id;

  -- Insert status event
  insert into public.donation_status_events (
    donation_id, from_status, to_status, note, changed_by
  ) values (
    p_donation_id, v_current_status, p_next_status, p_note, v_user_id
  );

  -- Create notification for donor
  insert into public.notifications (
    user_id, title, body, type, reference_id
  ) values (
    v_donor_id,
    'Status donasi diperbarui',
    'Donasi ' || v_donation_code || ' berubah dari ' || v_current_status || ' ke ' || p_next_status || '.',
    'donation_update',
    p_donation_id
  );

  v_result := jsonb_build_object(
    'id', p_donation_id,
    'donation_code', v_donation_code,
    'from_status', v_current_status,
    'to_status', p_next_status
  );

  return v_result;
end;
$$;

-- ============================================================
-- RLS: notifications
-- ============================================================
alter table public.notifications enable row level security;

create policy "user read own notifications"
  on public.notifications for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "user update own notifications"
  on public.notifications for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "system insert notifications"
  on public.notifications for insert
  to authenticated
  with check (true);

-- ============================================================
-- RLS: activity_feed
-- ============================================================
alter table public.activity_feed enable row level security;

create policy "public read public activity"
  on public.activity_feed for select
  using (is_public = true);

create policy "authenticated read activity"
  on public.activity_feed for select
  to authenticated
  using (true);

-- ============================================================
-- RLS: impact_statistics
-- ============================================================
alter table public.impact_statistics enable row level security;

create policy "public read stats"
  on public.impact_statistics for select
  using (true);

create policy "admin update stats"
  on public.impact_statistics for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- ============================================================
-- RLS: newsletter_subscribers
-- ============================================================
alter table public.newsletter_subscribers enable row level security;

create policy "public insert newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "authenticated read own subscription"
  on public.newsletter_subscribers for select
  to authenticated
  using (true);

create policy "admin manage newsletter"
  on public.newsletter_subscribers for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );
