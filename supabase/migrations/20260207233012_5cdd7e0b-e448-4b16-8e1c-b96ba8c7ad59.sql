-- Drop the existing permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert translations" ON translations_cache;

-- Create a new policy that only allows service_role to insert translations
-- Edge Functions use service_role, so this protects against public abuse
CREATE POLICY "Only service role can insert translations"
ON translations_cache
FOR INSERT
TO service_role
WITH CHECK (true);

-- Also add a policy for authenticated users to insert (in case needed in future)
-- But for now, we'll keep it service_role only since translations come from Edge Function