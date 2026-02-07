import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

// Simple hash function for caching
const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

interface UseTranslatedDescriptionResult {
  translatedHtml: string | undefined;
  isTranslating: boolean;
}

export const useTranslatedDescription = (
  descriptionHtml: string | undefined
): UseTranslatedDescriptionResult => {
  const { i18n } = useTranslation();
  const [translatedHtml, setTranslatedHtml] = useState<string | undefined>(undefined);
  const [isTranslating, setIsTranslating] = useState(false);
  const translationInProgress = useRef(false);

  useEffect(() => {
    // If no description or language is English, return original
    if (!descriptionHtml || i18n.language.startsWith('en')) {
      setTranslatedHtml(descriptionHtml);
      setIsTranslating(false);
      return;
    }

    const targetLang = i18n.language.split('-')[0]; // 'ru-RU' -> 'ru'
    const sourceHash = hashString(descriptionHtml);

    const translateDescription = async () => {
      if (translationInProgress.current) return;
      translationInProgress.current = true;
      setIsTranslating(true);

      try {
        // 1. Check cache first
        const { data: cached } = await supabase
          .from('translations_cache')
          .select('translated_text')
          .eq('source_hash', sourceHash)
          .eq('target_lang', targetLang)
          .maybeSingle();

        if (cached?.translated_text) {
          setTranslatedHtml(cached.translated_text);
          setIsTranslating(false);
          translationInProgress.current = false;
          return;
        }

        // 2. Call translate edge function
        const { data, error } = await supabase.functions.invoke('translate', {
          body: {
            text: descriptionHtml,
            targetLang,
            sourceHash,
          },
        });

        if (error) {
          console.error('Translation error:', error);
          setTranslatedHtml(descriptionHtml);
        } else if (data?.translated) {
          setTranslatedHtml(data.translated);
        } else {
          setTranslatedHtml(descriptionHtml);
        }
      } catch (err) {
        console.error('Translation failed:', err);
        setTranslatedHtml(descriptionHtml);
      } finally {
        setIsTranslating(false);
        translationInProgress.current = false;
      }
    };

    translateDescription();
  }, [descriptionHtml, i18n.language]);

  return { translatedHtml, isTranslating };
};
