-- Close privilege-escalation and private-data exposure paths.

-- RLS protects rows, while column grants protect privileged profile fields.
revoke update on table public.profiles from authenticated;
grant update (
  username,
  full_name,
  phone,
  address,
  avatar_path,
  birth_date,
  email,
  password_last_updated,
  updated_at
) on table public.profiles to authenticated;

create or replace function public.is_staff(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = p_user_id
      and profile.role in ('admin', 'manager')
  );
$$;

revoke all on function public.is_staff(uuid) from public;
grant execute on function public.is_staff(uuid) to authenticated;

drop policy if exists "authenticated users read profiles" on public.profiles;
drop policy if exists "staff read profiles" on public.profiles;
create policy "staff read profiles"
  on public.profiles for select
  to authenticated
  using ((select public.is_staff(auth.uid())));

-- Public-facing profile data is exposed explicitly without private columns.
create or replace function public.get_public_profiles(p_ids uuid[])
returns table (
  id uuid,
  full_name text,
  username text,
  avatar_path text
)
language sql
stable
security definer
set search_path = ''
as $$
  select profile.id, profile.full_name, profile.username, profile.avatar_path
  from public.profiles as profile
  where profile.id = any(coalesce(p_ids, array[]::uuid[]));
$$;

revoke all on function public.get_public_profiles(uuid[]) from public;
grant execute on function public.get_public_profiles(uuid[]) to authenticated;

-- Statistics are changed only by trusted server-side code.
revoke all on function public.increment_stat(text, bigint) from public, anon, authenticated;
grant execute on function public.increment_stat(text, bigint) to service_role;

-- Subscribers cannot enumerate other subscribers' email addresses.
drop policy if exists "authenticated read own subscription" on public.newsletter_subscribers;

