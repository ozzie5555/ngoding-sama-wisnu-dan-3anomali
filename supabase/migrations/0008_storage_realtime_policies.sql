-- ============================================================
-- Migration 0008: Storage Buckets and Realtime Publication
-- ============================================================

-- ============================================================
-- Storage Buckets
-- Run these via Supabase Dashboard > Storage > New Bucket
-- OR via SQL below (Supabase supports storage API in SQL)
-- ============================================================

-- Note: In Supabase, buckets are created via the storage API.
-- The following are the bucket configurations needed.
-- Execute these via the Supabase Dashboard or Edge Functions.

-- Bucket: item-photos
-- Public: false (private, signed URLs)
-- File size limit: 5MB
-- Allowed MIME: image/jpeg, image/png, image/webp, image/heic

-- Bucket: profile-photos
-- Public: true (avatars are public)
-- File size limit: 2MB
-- Allowed MIME: image/jpeg, image/png, image/webp

-- Bucket: community-assets
-- Public: true (logos are public)
-- File size limit: 3MB
-- Allowed MIME: image/jpeg, image/png, image/webp, image/svg+xml

-- Bucket: article-media
-- Public: true (covers are public)
-- File size limit: 5MB
-- Allowed MIME: image/jpeg, image/png, image/webp

-- Bucket: documentation-media
-- Public: false (admin/manager uploaded, private)
-- File size limit: 10MB
-- Allowed MIME: image/jpeg, image/png, image/webp, video/mp4

-- ============================================================
-- Storage Policies (RLS for Storage)
-- ============================================================

-- Profile photos: owner can upload, anyone can read
-- (configured via Supabase Dashboard Storage Policies)

-- Item photos: owner can upload, owner/admin/manager can read
-- Community assets: manager/admin can upload, public read
-- Article media: admin can upload, public read for published
-- Documentation media: admin/manager can upload, public read

-- ============================================================
-- Realtime Publication
-- Enable realtime for key tables
-- ============================================================

-- These need to be enabled via Supabase Dashboard > Database > Replication
-- OR via SQL:

-- Tables to enable realtime:
-- 1. donations (for tracking updates)
-- 2. donation_status_events (for timeline)
-- 3. notifications (for user notifications)
-- 4. chat_messages (for live chat)
-- 5. activity_feed (for public activity)

-- ============================================================
-- Helper: Subscribe to donation changes (FE example)
-- ============================================================
-- In React component:
--
-- useEffect(() => {
--   const channel = supabase
--     .channel('donation-changes')
--     .on('postgres_changes',
--       { event: '*', schema: 'public', table: 'donations', filter: `donor_id=eq.${user.id}` },
--       (payload) => { /* handle update */ }
--     )
--     .subscribe()
--
--   return () => { supabase.removeChannel(channel) }
-- }, [user.id])

-- ============================================================
-- Helper: Subscribe to notifications (FE example)
-- ============================================================
-- useEffect(() => {
--   const channel = supabase
--     .channel('notification-changes')
--     .on('postgres_changes',
--       { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
--       (payload) => { /* show notification */ }
--     )
--     .subscribe()
--
--   return () => { supabase.removeChannel(channel) }
-- }, [user.id])
