alter table public.chat_messages
  add column if not exists edited_at timestamptz;

drop policy if exists "user update own messages" on public.chat_messages;
create policy "user update own messages"
  on public.chat_messages for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
