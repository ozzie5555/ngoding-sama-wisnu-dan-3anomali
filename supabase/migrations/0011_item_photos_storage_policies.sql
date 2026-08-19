-- ============================================================
-- Migration 0011: Storage policies for item-photos (safe to re-run)
-- ============================================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Donors can upload item photos" ON storage.objects;
DROP POLICY IF EXISTS "Donors can view own item photos" ON storage.objects;
DROP POLICY IF EXISTS "Donors can update own item photos" ON storage.objects;

-- Allow authenticated users to upload their own donation photos
CREATE POLICY "Donors can upload item photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'item-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow donors to read their own donation photos
CREATE POLICY "Donors can view own item photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'item-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow donors to update their own donation photos
CREATE POLICY "Donors can update own item photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'item-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
