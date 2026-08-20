-- Keep the donations table constraint aligned with transition_donation_status.
-- Canonical flow: pending -> verified -> pickup -> shipping -> received.

update public.donations
set status = 'shipping'
where status = 'in_transit';

alter table public.donations
  drop constraint if exists donations_status_check;

alter table public.donations
  add constraint donations_status_check
  check (status in ('pending', 'verified', 'pickup', 'shipping', 'received', 'cancelled'));
