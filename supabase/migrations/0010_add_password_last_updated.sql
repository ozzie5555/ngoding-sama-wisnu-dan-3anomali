-- ============================================================
-- Migration 0010: Add password_last_updated to profiles
-- Tracks when user last changed their password
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS password_last_updated timestamptz;
