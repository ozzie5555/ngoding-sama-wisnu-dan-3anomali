-- Keep the community leaderboard consistent across environments.
-- Every submitted donation counts immediately unless it is cancelled.

drop function if exists public.get_top_donors(integer);

create function public.get_top_donors(p_limit integer default 4)
returns table (
  donor_id uuid,
  donor_name text,
  username text,
  avatar_path text,
  total_items bigint,
  total_donations bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    profile.id as donor_id,
    profile.full_name as donor_name,
    profile.username,
    profile.avatar_path,
    coalesce(sum(donation.quantity), 0)::bigint as total_items,
    count(donation.id)::bigint as total_donations
  from public.donations as donation
  join public.profiles as profile on profile.id = donation.donor_id
  left join public.profile_settings as settings on settings.user_id = profile.id
  where donation.status <> 'cancelled'
    and coalesce(settings.contribution_visibility, true)
  group by profile.id, profile.full_name, profile.username, profile.avatar_path
  order by total_items desc, total_donations desc, min(donation.submitted_at) asc
  limit greatest(1, least(coalesce(p_limit, 4), 20));
$$;

revoke all on function public.get_top_donors(integer) from public;
grant execute on function public.get_top_donors(integer) to anon, authenticated;
