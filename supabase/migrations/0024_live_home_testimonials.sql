-- Publish verified-donation testimonials immediately and broadcast them to Home.

drop policy if exists "user insert own testimonial" on public.testimonials;
revoke insert on public.testimonials from authenticated;

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
  v_user_id uuid := auth.uid();
  v_donation_status text;
  v_testimonial_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select status into v_donation_status
  from public.donations
  where id = p_donation_id and donor_id = v_user_id;

  if not found then
    raise exception 'Donation not found or not owned by you';
  end if;

  if v_donation_status != 'received' then
    raise exception 'Can only create testimonial after donation is received';
  end if;

  if exists (
    select 1 from public.testimonials where donation_id = p_donation_id
  ) then
    raise exception 'Testimonial already exists for this donation';
  end if;

  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'Rating must be between 1 and 5';
  end if;

  if p_content is null or length(trim(p_content)) < 3 or length(trim(p_content)) > 1000 then
    raise exception 'Testimonial content must be between 3 and 1000 characters';
  end if;

  insert into public.testimonials (
    user_id, donation_id, rating, title, content, is_approved, approved_at
  )
  values (
    v_user_id, p_donation_id, p_rating, p_title, trim(p_content), true, now()
  )
  returning id into v_testimonial_id;

  return jsonb_build_object(
    'id', v_testimonial_id,
    'is_approved', true,
    'message', 'Testimonial published'
  );
end;
$$;

revoke all on function public.create_testimonial(uuid, integer, text, text) from public;
grant execute on function public.create_testimonial(uuid, integer, text, text) to authenticated;

create or replace function public.get_home_testimonials(p_limit integer default 12)
returns table (
  id uuid,
  content text,
  created_at timestamptz,
  full_name text,
  username text,
  avatar_path text
)
language sql
stable
security definer set search_path = ''
as $$
  select t.id, t.content, t.created_at, p.full_name, p.username, p.avatar_path
  from public.testimonials t
  join public.profiles p on p.id = t.user_id
  where t.is_approved = true
  order by t.created_at desc
  limit least(greatest(coalesce(p_limit, 12), 1), 24);
$$;

revoke all on function public.get_home_testimonials(integer) from public;
grant execute on function public.get_home_testimonials(integer) to anon, authenticated;

-- Publish valid reviews created before this migration.
update public.testimonials t
set is_approved = true,
    approved_at = coalesce(t.approved_at, now())
where t.is_approved = false
  and exists (
    select 1
    from public.donations d
    where d.id = t.donation_id
      and d.donor_id = t.user_id
      and d.status = 'received'
  );

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'testimonials'
  ) then
    alter publication supabase_realtime add table public.testimonials;
  end if;
end;
$$;
