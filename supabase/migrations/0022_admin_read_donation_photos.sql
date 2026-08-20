-- Allow authorized staff to read the actual photos attached to donations.

drop policy if exists "staff read donation items" on public.donation_items;

create policy "staff read donation items"
  on public.donation_items for select
  to authenticated
  using (
    exists (
      select 1
      from public.donations d
      left join public.communities c on c.id = d.community_id
      where d.id = donation_items.donation_id
        and (
          c.manager_id = (select auth.uid())
          or exists (
            select 1
            from public.profiles p
            where p.id = (select auth.uid())
              and p.role = 'admin'
          )
        )
    )
  );

drop policy if exists "Staff can view donation photos" on storage.objects;

create policy "Staff can view donation photos"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'item-photos'
    and exists (
      select 1
      from public.donation_items di
      join public.donations d on d.id = di.donation_id
      left join public.communities c on c.id = d.community_id
      where di.storage_path = storage.objects.name
        and (
          c.manager_id = (select auth.uid())
          or exists (
            select 1
            from public.profiles p
            where p.id = (select auth.uid())
              and p.role = 'admin'
          )
        )
    )
  );
