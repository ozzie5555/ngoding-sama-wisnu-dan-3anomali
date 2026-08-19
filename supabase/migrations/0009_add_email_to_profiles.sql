-- ============================================================
-- Migration 0009: Add email column to profiles
-- Enables username login by storing email in profiles table
-- ============================================================

-- Add email column
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);

-- Update trigger to also store email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, email)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', 'user-' || left(new.id::text, 8)),
    new.email
  );

  INSERT INTO public.profile_settings (user_id) VALUES (new.id);
  RETURN new;
END;
$$;

-- Backfill email for existing users from auth.users
UPDATE public.profiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id AND p.email IS NULL;
