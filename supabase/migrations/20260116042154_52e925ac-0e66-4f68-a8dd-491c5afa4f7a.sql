-- Fix overly permissive INSERT policy - require reviews to be unapproved by default
ALTER TABLE public.reviews ALTER COLUMN is_approved SET DEFAULT false;

-- Drop the current overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;

-- Create a new INSERT policy that enforces is_approved = false
CREATE POLICY "Anyone can insert unapproved reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (is_approved = false);

-- Add restrictive UPDATE policy - no one can update reviews (prevents manipulation)
CREATE POLICY "No one can update reviews"
  ON public.reviews FOR UPDATE
  USING (false);

-- Add restrictive DELETE policy - no one can delete reviews (prevents removal of genuine reviews)
CREATE POLICY "No one can delete reviews"
  ON public.reviews FOR DELETE
  USING (false);