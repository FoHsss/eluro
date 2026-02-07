-- Create translations cache table for AI-translated product descriptions
CREATE TABLE public.translations_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_hash TEXT NOT NULL,
  source_lang TEXT NOT NULL DEFAULT 'en',
  target_lang TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create unique index for fast lookups
CREATE UNIQUE INDEX idx_translations_cache_lookup ON public.translations_cache (source_hash, target_lang);

-- Enable RLS
ALTER TABLE public.translations_cache ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read translations (public cache)
CREATE POLICY "Anyone can read translations"
ON public.translations_cache
FOR SELECT
USING (true);

-- Allow anyone to insert translations (edge function will do this)
CREATE POLICY "Anyone can insert translations"
ON public.translations_cache
FOR INSERT
WITH CHECK (true);

-- No updates or deletes needed
CREATE POLICY "No one can update translations"
ON public.translations_cache
FOR UPDATE
USING (false);

CREATE POLICY "No one can delete translations"
ON public.translations_cache
FOR DELETE
USING (false);