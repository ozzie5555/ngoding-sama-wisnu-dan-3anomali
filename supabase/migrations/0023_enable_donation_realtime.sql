-- Broadcast donation updates so donor activity/history refreshes without a page reload.

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'donations'
  ) then
    alter publication supabase_realtime add table public.donations;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'donation_status_events'
  ) then
    alter publication supabase_realtime add table public.donation_status_events;
  end if;
end;
$$;
