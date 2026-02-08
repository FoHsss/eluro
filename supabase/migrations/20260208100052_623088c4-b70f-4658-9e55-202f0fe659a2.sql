-- Add photo_urls column to reviews table
ALTER TABLE public.reviews ADD COLUMN photo_urls text[] DEFAULT '{}';

-- Create storage bucket for review photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-photos', 'review-photos', true);

-- RLS policy: Anyone can upload review photos
CREATE POLICY "Anyone can upload review photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'review-photos');

-- RLS policy: Anyone can view review photos
CREATE POLICY "Anyone can view review photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');