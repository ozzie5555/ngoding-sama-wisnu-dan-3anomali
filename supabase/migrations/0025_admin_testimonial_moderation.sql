-- Restore admin moderation while keeping Home updates realtime.

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
  if v_user_id is null then raise exception 'Authentication required'; end if;

  select status into v_donation_status
  from public.donations
  where id = p_donation_id and donor_id = v_user_id;

  if not found then raise exception 'Donation not found or not owned by you'; end if;
  if v_donation_status != 'received' then
    raise exception 'Can only create testimonial after donation is received';
  end if;
  if exists (select 1 from public.testimonials where donation_id = p_donation_id) then
    raise exception 'Testimonial already exists for this donation';
  end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'Rating must be between 1 and 5';
  end if;
  if p_content is null or length(trim(p_content)) < 3 or length(trim(p_content)) > 1000 then
    raise exception 'Testimonial content must be between 3 and 1000 characters';
  end if;

  insert into public.testimonials (user_id, donation_id, rating, title, content, is_approved)
  values (v_user_id, p_donation_id, p_rating, p_title, trim(p_content), false)
  returning id into v_testimonial_id;

  return jsonb_build_object(
    'id', v_testimonial_id,
    'is_approved', false,
    'message', 'Testimonial submitted for admin review'
  );
end;
$$;

create or replace function public.moderate_testimonial(
  p_testimonial_id uuid,
  p_approved boolean
)
returns jsonb
language plpgsql
security definer set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null or not exists (
    select 1 from public.profiles where id = v_user_id and role = 'admin'
  ) then
    raise exception 'Admin access required';
  end if;

  update public.testimonials
  set is_approved = p_approved,
      approved_by = case when p_approved then v_user_id else null end,
      approved_at = case when p_approved then now() else null end
  where id = p_testimonial_id;

  if not found then raise exception 'Testimonial not found'; end if;

  return jsonb_build_object('id', p_testimonial_id, 'is_approved', p_approved);
end;
$$;

revoke all on function public.moderate_testimonial(uuid, boolean) from public;
grant execute on function public.moderate_testimonial(uuid, boolean) to authenticated;

create or replace function public.broadcast_home_testimonial_change()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  perform realtime.send(
    jsonb_build_object('testimonial_id', new.id),
    'changed',
    'home:testimonials',
    false
  );
  return new;
end;
$$;

drop trigger if exists broadcast_home_testimonial_change on public.testimonials;
create trigger broadcast_home_testimonial_change
  after insert or update of is_approved on public.testimonials
  for each row execute function public.broadcast_home_testimonial_change();
