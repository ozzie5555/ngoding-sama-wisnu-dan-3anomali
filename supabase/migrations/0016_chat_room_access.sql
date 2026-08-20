-- Chat room bootstrap for community chat.
-- The security-definer function keeps room/member creation atomic while
-- clients remain unable to insert arbitrary rooms or memberships.

create or replace function public.get_or_create_community_chat_room(p_community_slug text default null)
returns public.chat_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_community_id uuid;
  v_room public.chat_rooms;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_community_slug is not null and p_community_slug <> 'general' then
    select id into v_community_id
    from public.communities
    where slug = p_community_slug and is_active = true
    limit 1;
    if v_community_id is null then
      raise exception 'Community not found' using errcode = 'P0002';
    end if;
  end if;

  select * into v_room
  from public.chat_rooms
  where room_type = 'community'
    and is_active = true
    and ((v_community_id is null and community_id is null) or community_id = v_community_id)
  order by created_at
  limit 1;

  if v_room.id is null then
    insert into public.chat_rooms (name, room_type, community_id, created_by)
    values (coalesce(nullif(p_community_slug, ''), 'general'), 'community', v_community_id, v_user_id)
    returning * into v_room;
  end if;

  insert into public.chat_members (room_id, user_id)
  values (v_room.id, v_user_id)
  on conflict (room_id, user_id) do nothing;

  return v_room;
end;
$$;

revoke all on function public.get_or_create_community_chat_room(text) from public;
grant execute on function public.get_or_create_community_chat_room(text) to authenticated;

alter publication supabase_realtime add table public.chat_messages;
