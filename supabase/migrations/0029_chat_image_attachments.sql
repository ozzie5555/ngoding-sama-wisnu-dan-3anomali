-- Private image attachments for community chat.

alter table public.chat_messages
  add column if not exists attachment_paths text[] not null default '{}';

alter table public.chat_messages
  drop constraint if exists chat_messages_attachment_limit;

alter table public.chat_messages
  add constraint chat_messages_attachment_limit
  check (cardinality(attachment_paths) <= 4);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-images',
  'chat-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Chat members can upload images" on storage.objects;
create policy "Chat members can upload images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Chat members can read images" on storage.objects;
create policy "Chat members can read images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'chat-images'
    and exists (
      select 1
      from public.chat_messages message
      where storage.objects.name = any(message.attachment_paths)
        and public.is_chat_member(message.room_id, auth.uid())
    )
  );

drop policy if exists "Users can delete own chat images" on storage.objects;
create policy "Users can delete own chat images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "member insert messages" on public.chat_messages;
create policy "member insert messages"
  on public.chat_messages for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and public.is_chat_member(room_id, auth.uid())
    and not exists (
      select 1
      from unnest(attachment_paths) as attachment_path
      where split_part(attachment_path, '/', 1) <> (select auth.uid())::text
    )
  );

drop policy if exists "user update own messages" on public.chat_messages;
create policy "user update own messages"
  on public.chat_messages for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and not exists (
      select 1
      from unnest(attachment_paths) as attachment_path
      where split_part(attachment_path, '/', 1) <> (select auth.uid())::text
    )
  );
