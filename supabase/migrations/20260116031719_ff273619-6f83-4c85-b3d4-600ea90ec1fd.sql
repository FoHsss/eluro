-- Таблица отзывов
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_handle TEXT NOT NULL,
  author_name TEXT NOT NULL CHECK (char_length(author_name) >= 2 AND char_length(author_name) <= 100),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL CHECK (char_length(comment) >= 10 AND char_length(comment) <= 1000),
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Индекс для быстрого поиска по продукту
CREATE INDEX idx_reviews_product_handle ON public.reviews(product_handle);

-- Индекс для фильтрации одобренных отзывов
CREATE INDEX idx_reviews_approved ON public.reviews(is_approved) WHERE is_approved = true;

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать одобренные отзывы
CREATE POLICY "Anyone can read approved reviews"
  ON public.reviews FOR SELECT
  USING (is_approved = true);

-- Политика: все могут добавлять отзывы
CREATE POLICY "Anyone can insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (true);