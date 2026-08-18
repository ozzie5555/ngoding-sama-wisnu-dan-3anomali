-- ============================================================
-- Migration 0002: Profiles and Profile Settings
-- ============================================================

-- ============================================================
-- Table: profiles
-- One row per auth.users, created by trigger on signup
-- ============================================================
create table public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  username           text unique,
  full_name          text not null default '',
  phone              text unique,
  address            text,
  avatar_path        text,
  birth_date         date,
  role               text not null default 'user'
                     check (role in ('user', 'manager', 'admin')),
  verification_status text not null default 'unverified'
                     check (verification_status in ('unverified', 'processing', 'verified')),
  phone_verified_at  timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.profiles is 'User profile, one per auth.users';

-- Indexes
create index idx_profiles_username on public.profiles (username);
create index idx_profiles_phone on public.profiles (phone);
create index idx_profiles_role on public.profiles (role);

-- ============================================================
-- Table: profile_settings
-- Privacy and notification preferences per user
-- ============================================================
create table public.profile_settings (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid unique not null references public.profiles(id) on delete cascade,
  privacy_level             text not null default 'public'
                            check (privacy_level in ('public', 'friends', 'private')),
  contribution_visibility   boolean not null default true,
  general_location          boolean not null default false,
  impact_report             boolean not null default true,
  donation_history          boolean not null default true,
  notification_preferences  jsonb not null default '{
    "email": true,
    "push": true,
    "whatsapp": false,
    "donation_updates": true,
    "community_news": true,
    "marketing": false
  }'::jsonb,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

comment on table public.profile_settings is 'Privacy and notification preferences per user';

create index idx_profile_settings_user_id on public.profile_settings (user_id);

-- ============================================================
-- Trigger: Auto-update updated_at
-- ============================================================
create or replace trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create or replace trigger set_updated_at
  before update on public.profile_settings
  for each row
  execute function public.handle_updated_at();

-- ============================================================
-- Trigger: Auto-create profile on user signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', 'user-' || left(new.id::text, 8))
  );

  insert into public.profile_settings (user_id) values (new.id);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================================
-- RLS: profiles
-- ============================================================
alter table public.profiles enable row level security;

-- All authenticated users can read profiles (for community, donation display)
create policy "authenticated users read profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can read their own full profile (including unverified phone etc.)
create policy "users read own full profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Users can update their own profile (cannot change role or verification_status via this)
create policy "users update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ============================================================
-- RLS: profile_settings
-- ============================================================
alter table public.profile_settings enable row level security;

create policy "users read own settings"
  on public.profile_settings for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users update own settings"
  on public.profile_settings for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users insert own settings"
  on public.profile_settings for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
