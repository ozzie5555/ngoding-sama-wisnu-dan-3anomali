-- Fix recursive chat RLS policies. The membership check runs with the
-- function owner privileges so policies do not recursively query chat_members.

create or replace function public.is_chat_member(p_room_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.chat_members
    where room_id = p_room_id and user_id = p_user_id
  );
$$;

revoke all on function public.is_chat_member(uuid, uuid) from public;
grant execute on function public.is_chat_member(uuid, uuid) to authenticated;

drop policy if exists "member read own rooms" on public.chat_members;
drop policy if exists "room members read membership" on public.chat_members;
create policy "member read own rooms"
  on public.chat_members for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "room members read membership"
  on public.chat_members for select
  to authenticated
  using (public.is_chat_member(room_id, auth.uid()));

drop policy if exists "member read room messages" on public.chat_messages;
drop policy if exists "member insert messages" on public.chat_messages;
create policy "member read room messages"
  on public.chat_messages for select
  to authenticated
  using (public.is_chat_member(room_id, auth.uid()));
create policy "member insert messages"
  on public.chat_messages for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and public.is_chat_member(room_id, auth.uid())
  );
