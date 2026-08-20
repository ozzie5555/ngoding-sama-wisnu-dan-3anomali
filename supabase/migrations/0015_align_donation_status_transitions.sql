-- Migration 0015: Align donation status transitions with the canonical pickup/shipping flow
-- Canonical flow: pending -> verified -> pickup -> shipping -> received

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
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select role into v_user_role from public.profiles where id = v_user_id;
  select status, community_id, donation_code, donor_id
  into v_current_status, v_community_id, v_donation_code, v_donor_id
  from public.donations where id = p_donation_id;

  if not found then raise exception 'Donation not found'; end if;

  select manager_id into v_community_manager from public.communities where id = v_community_id;
  if v_user_role != 'admin' and v_community_manager != v_user_id then
    raise exception 'Not authorized to transition this donation';
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
      received_at = case when p_next_status = 'received' then now() else received_at end
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
