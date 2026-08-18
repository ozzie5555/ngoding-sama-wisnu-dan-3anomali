-- ============================================================
-- Migration 0001: Extensions and Helper Functions
-- ============================================================

-- UUID generation (usually enabled by default in Supabase)
-- create extension if not exists "uuid-ossp";

-- ============================================================
-- Helper: Generate unique donation code
-- Format: KMB-YYYY-NNNNN
-- ============================================================
create or replace function public.generate_donation_code()
returns text
language plpgsql
security definer set search_path = ''
as $$
declare
  yr text;
  seq int;
  code text;
begin
  yr := to_char(now(), 'YYYY');

  -- Get next sequence number for this year
  select coalesce(max(
    nullif(
      regexp_replace(donation_code, '^KMB-\d{4}-', ''), ''
    )::int
  ), 0) + 1
  into seq
  from public.donations
  where donation_code like 'KMB-' || yr || '-%';

  code := 'KMB-' || yr || '-' || lpad(seq::text, 5, '0');
  return code;
end;
$$;

-- ============================================================
-- Helper: Updated_at trigger function
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- Note: updated_at triggers are added in each migration
-- after the respective table is created (0002, 0003, etc.)
-- ============================================================
