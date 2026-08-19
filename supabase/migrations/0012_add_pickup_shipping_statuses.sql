-- ============================================================
-- Migration 0012: Add pickup & shipping donation statuses
-- ============================================================

-- Drop old check constraint and add new one with 7 statuses
ALTER TABLE public.donations
  DROP CONSTRAINT IF EXISTS donations_status_check;

ALTER TABLE public.donations
  ADD CONSTRAINT donations_status_check
  CHECK (status IN ('pending', 'verified', 'pickup', 'shipping', 'received', 'cancelled'));
