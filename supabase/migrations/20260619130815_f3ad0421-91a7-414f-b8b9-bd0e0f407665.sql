
-- Drop overly permissive policies on review-photos bucket
DROP POLICY IF EXISTS "Anyone can view review photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload review photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view review photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload review photos" ON storage.objects;

-- Restrict uploads: must be under reviews/ folder, image MIME, size < 5MB, image extension
CREATE POLICY "Restricted review photo uploads"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'review-photos'
  AND (storage.foldername(name))[1] = 'reviews'
  AND lower(storage.extension(name)) IN ('jpg','jpeg','png','webp','gif')
  AND (metadata->>'mimetype') LIKE 'image/%'
  AND COALESCE((metadata->>'size')::bigint, 0) < 5242880
);

-- Service role can manage (update/delete) for moderation/cleanup
CREATE POLICY "Service role can manage review photos"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'review-photos')
WITH CHECK (bucket_id = 'review-photos');

CREATE POLICY "Service role can delete review photos"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'review-photos');
