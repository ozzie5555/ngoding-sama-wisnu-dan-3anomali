-- Multi-admin donation monitoring and safe task ownership.

alter table public.donations
  add column if not exists assigned_to uuid references public.profiles(id) on delete set null,
  add column if not exists assigned_at timestamptz;

create index if not exists idx_donations_assigned_to
  on public.donations (assigned_to);

create or replace function public.claim_donation(
  p_donation_id uuid,
  p_claim boolean default true
)
returns jsonb
language plpgsql
security definer set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_user_role text;
  v_community_id uuid;
  v_community_manager uuid;
  v_status text;
  v_assigned_to uuid;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;

  select role into v_user_role
  from public.profiles
  where id = v_user_id;

  select community_id, status, assigned_to
  into v_community_id, v_status, v_assigned_to
  from public.donations
  where id = p_donation_id
  for update;

  if not found then raise exception 'Donation not found'; end if;

  select manager_id into v_community_manager
  from public.communities
  where id = v_community_id;

  if v_user_role != 'admin' and v_community_manager != v_user_id then
    raise exception 'Not authorized to handle this donation';
  end if;

  if v_status in ('received', 'cancelled') then
    raise exception 'Completed donations cannot be assigned';
  end if;

  if p_claim then
    if v_assigned_to is not null and v_assigned_to != v_user_id then
      raise exception 'Donation is being handled by another admin';
    end if;

    update public.donations
    set assigned_to = v_user_id,
        assigned_at = coalesce(assigned_at, now())
    where id = p_donation_id;
  else
    if v_assigned_to is distinct from v_user_id then
      raise exception 'Only the assigned admin can release this donation';
    end if;

    update public.donations
    set assigned_to = null,
        assigned_at = null
    where id = p_donation_id;
  end if;

  return jsonb_build_object(
    'id', p_donation_id,
    'assigned_to', case when p_claim then v_user_id else null end
  );
end;
$$;

grant execute on function public.claim_donation(uuid, boolean) to authenticated;

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
  v_user_id uuid := auth.uid();
  v_user_role text;
  v_current_status text;
  v_community_id uuid;
  v_community_manager uuid;
  v_donation_code text;
  v_donor_id uuid;
  v_assigned_to uuid;
  v_valid boolean := false;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;

  select role into v_user_role
  from public.profiles
  where id = v_user_id;

  select status, community_id, donation_code, donor_id, assigned_to
  into v_current_status, v_community_id, v_donation_code, v_donor_id, v_assigned_to
  from public.donations
  where id = p_donation_id
  for update;

  if not found then raise exception 'Donation not found'; end if;

  select manager_id into v_community_manager
  from public.communities
  where id = v_community_id;

  if v_user_role != 'admin' and v_community_manager != v_user_id then
    raise exception 'Not authorized to transition this donation';
  end if;

  if v_assigned_to is distinct from v_user_id then
    raise exception 'Claim this donation before changing its status';
  end if;

  v_valid := case
    when v_current_status = 'pending' and p_next_status = 'verified' then true
    when v_current_status = 'verified' and p_next_status = 'pickup' then true
    when v_current_status = 'pickup' and p_next_status = 'shipping' then true
    when v_current_status = 'shipping' and p_next_status = 'received' then true
    when v_current_status in ('pending', 'verified', 'pickup') and p_next_status = 'cancelled' then true
    else false
  end;

  if not v_valid then
    raise exception 'Invalid transition from % to %', v_current_status, p_next_status;
  end if;

  update public.donations
  set status = p_next_status,
      received_at = case when p_next_status = 'received' then now() else received_at end,
      assigned_to = case when p_next_status in ('received', 'cancelled') then null else v_user_id end,
      assigned_at = case when p_next_status in ('received', 'cancelled') then null else assigned_at end
  where id = p_donation_id;

  insert into public.donation_status_events (donation_id, from_status, to_status, note, changed_by)
  values (p_donation_id, v_current_status, p_next_status, p_note, v_user_id);

  insert into public.notifications (user_id, title, body, type, reference_id)
  values (
    v_donor_id,
    'Status donasi diperbarui',
    'Donasi ' || v_donation_code || ' berubah dari ' || v_current_status || ' ke ' || p_next_status || '.',
    'donation_update',
    p_donation_id
  );

  return jsonb_build_object(
    'id', p_donation_id,
    'donation_code', v_donation_code,
    'from_status', v_current_status,
    'to_status', p_next_status
  );
end;
$$;

grant execute on function public.transition_donation_status(uuid, text, text) to authenticated;
