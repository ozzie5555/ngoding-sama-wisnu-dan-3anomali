-- Migration 0014: Safe username lookup for pre-auth login
-- Returns only the email needed by Supabase Auth sign-in.

create or replace function public.lookup_email_by_username(p_username text)
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select p.email
  from public.profiles as p
  where lower(regexp_replace(p.username, '^@', ''))
    = lower(regexp_replace(trim(p_username), '^@', ''))
  limit 1;
$$;

revoke all on function public.lookup_email_by_username(text) from public;
grant execute on function public.lookup_email_by_username(text) to anon, authenticated;
