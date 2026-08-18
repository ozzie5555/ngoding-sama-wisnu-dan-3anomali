-- ============================================================
-- Migration 0007: Chat (Foundation)
-- ============================================================

-- ============================================================
-- Table: chat_rooms
-- ============================================================
create table public.chat_rooms (
  id            uuid primary key default gen_random_uuid(),
  name          text not null default '',
  room_type     text not null default 'community'
                check (room_type in ('community', 'direct', 'live_support')),
  community_id  uuid references public.communities(id) on delete set null,
  created_by    uuid references public.profiles(id) on delete set null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.chat_rooms is 'Chat rooms for community discussion and live support';

create index idx_chat_rooms_community_id on public.chat_rooms (community_id);
create index idx_chat_rooms_room_type on public.chat_rooms (room_type);

-- ============================================================
-- Table: chat_members
-- ============================================================
create table public.chat_members (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references public.chat_rooms(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        text not null default 'member'
              check (role in ('member', 'moderator', 'admin')),
  joined_at   timestamptz not null default now(),
  unique (room_id, user_id)
);

comment on table public.chat_members is 'Membership in chat rooms';

create index idx_chat_members_room_id on public.chat_members (room_id);
create index idx_chat_members_user_id on public.chat_members (user_id);

-- ============================================================
-- Table: chat_messages
-- ============================================================
create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references public.chat_rooms(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  message_type text not null default 'text'
               check (message_type in ('text', 'image', 'file', 'system')),
  is_deleted  boolean not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.chat_messages is 'Messages within chat rooms';

create index idx_chat_messages_room_id on public.chat_messages (room_id);
create index idx_chat_messages_created_at on public.chat_messages (created_at desc);

-- ============================================================
-- Table: live_chat_threads
-- Direct support chat between user and admin/manager
-- ============================================================
create table public.live_chat_threads (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  assigned_to   uuid references public.profiles(id) on delete set null,
  subject       text not null default '',
  status        text not null default 'open'
                check (status in ('open', 'in_progress', 'closed')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.live_chat_threads is 'Live support chat threads';

create index idx_live_chat_user_id on public.live_chat_threads (user_id);
create index idx_live_chat_status on public.live_chat_threads (status);

-- ============================================================
-- RLS: chat_rooms
-- ============================================================
alter table public.chat_rooms enable row level security;

create policy "authenticated read rooms"
  on public.chat_rooms for select
  to authenticated
  using (true);

-- ============================================================
-- RLS: chat_members
-- ============================================================
alter table public.chat_members enable row level security;

create policy "member read own rooms"
  on public.chat_members for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "room members read membership"
  on public.chat_members for select
  to authenticated
  using (
    exists (
      select 1 from public.chat_members cm
      where cm.room_id = chat_members.room_id and cm.user_id = (select auth.uid())
    )
  );

-- ============================================================
-- RLS: chat_messages
-- ============================================================
alter table public.chat_messages enable row level security;

-- Only room members can read messages
create policy "member read room messages"
  on public.chat_messages for select
  to authenticated
  using (
    exists (
      select 1 from public.chat_members
      where room_id = chat_messages.room_id and user_id = (select auth.uid())
    )
  );

-- Only room members can insert messages
create policy "member insert messages"
  on public.chat_messages for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.chat_members
      where room_id = chat_messages.room_id and user_id = (select auth.uid())
    )
  );

-- User can delete own messages
create policy "user delete own messages"
  on public.chat_messages for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ============================================================
-- RLS: live_chat_threads
-- ============================================================
alter table public.live_chat_threads enable row level security;

create policy "user read own threads"
  on public.live_chat_threads for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "assigned agent read threads"
  on public.live_chat_threads for select
  to authenticated
  using ((select auth.uid()) = assigned_to);

create policy "user create own thread"
  on public.live_chat_threads for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "agent update assigned threads"
  on public.live_chat_threads for update
  to authenticated
  using (
    (select auth.uid()) = assigned_to
    or exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );
