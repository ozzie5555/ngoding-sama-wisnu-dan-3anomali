alter table public.chat_messages
  add column if not exists reply_to_id uuid references public.chat_messages(id) on delete set null;

create index if not exists idx_chat_messages_reply_to_id
  on public.chat_messages(reply_to_id);
