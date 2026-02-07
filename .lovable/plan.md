

# Plan: Multilingual Site with Auto-Translation

## Overview
Add internationalization (i18n) support to the website with:
- English as the default language
- Automatic detection of browser/device language
- Fixed language switcher button on screen (accessible from any page)
- Automatic AI translation of product descriptions
- Reviews remain untranslated (as requested)

---

## Architecture

```text
+------------------+     +-------------------+
|   Browser opens  | --> | i18next detects   |
|   website        |     | navigator.language|
+------------------+     +-------------------+
                                  |
                    +-------------+-------------+
                    |                           |
              en-US / en                   ru-RU / ru
                    |                           |
                    v                           v
          +------------------+       +------------------+
          | Show English UI  |       | Show Russian UI  |
          +------------------+       +------------------+
                                            |
                                            v
                               +------------------------+
                               | Product descriptions   |
                               | translated via AI      |
                               | (cached in database)   |
                               +------------------------+
```

---

## File Structure

```text
src/
├── i18n/
│   ├── index.ts                    # i18next configuration
│   └── locales/
│       ├── en.json                 # English translations
│       └── ru.json                 # Russian translations
├── components/
│   ├── LanguageSwitcher.tsx        # Fixed language toggle button
│   └── Layout.tsx                  # Add LanguageSwitcher
├── hooks/
│   └── useTranslatedDescription.ts # AI translation hook
└── ... (updated components)

supabase/
└── functions/
    └── translate/
        └── index.ts                # AI translation edge function
```

---

## Implementation Steps

### 1. Install Dependencies

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### 2. Create i18n Configuration

**src/i18n/index.ts:**
- Initialize i18next with language detector
- Load English and Russian translations
- Auto-detect language from browser (navigator)
- Save user preference to localStorage
- Fallback to English if language not supported

### 3. Create Translation Files

**English (en.json)** - Original text:
- Navigation: Shop, About, Contact
- Hero section: taglines, titles, CTAs
- Product page: Add to Cart, Sold Out, Ready to ship, Gallery, Size chart
- Cart: Shopping Cart, empty state, Checkout
- Contact form: labels and placeholders
- Footer: links, copyright
- About page: full content
- Privacy/Terms pages: full content

**Russian (ru.json)** - Translations:
- All static UI text translated to Russian
- Maintaining the same structure as English

### 4. Create Language Switcher Component

**src/components/LanguageSwitcher.tsx:**
- Fixed position button in bottom-right corner
- Shows globe icon with current language code
- Click toggles between EN and RU
- Smooth animation on hover/click
- Uses backdrop blur for modern appearance
- Always visible on all pages (rendered in Layout)

Visual design:
```text
                    ┌────────────────┐
                    │ Page content   │
                    │                │
                    │                │
                    │        ┌─────┐ │
                    │        │🌐 RU│ │  <- Fixed button
                    └────────┴─────┴─┘
```

### 5. Create AI Translation Edge Function

**supabase/functions/translate/index.ts:**
- Uses Lovable AI (gemini-2.5-flash) - no API key needed
- Receives HTML text and target language
- Preserves HTML structure (strong, br, p tags)
- Returns translated text

### 6. Create Translation Cache Table

New database table `translations_cache`:
```sql
CREATE TABLE translations_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_hash TEXT NOT NULL,        -- MD5 hash of original text
  source_lang TEXT DEFAULT 'en',
  target_lang TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX ON translations_cache (source_hash, target_lang);
```

Benefits:
- First translation: 1-2 seconds (AI processing)
- Subsequent views: instant (from cache)
- Cache shared across all users

### 7. Create Translation Hook

**src/hooks/useTranslatedDescription.ts:**
- Takes original descriptionHtml
- If language is English - returns original
- If language is Russian:
  - Check cache first
  - If not cached - call translate edge function
  - Save to cache
  - Return translated text
- Shows loading state during translation

### 8. Update Components

Components to update with `useTranslation` hook:

| Component | What to translate |
|-----------|-------------------|
| Header.tsx | Navigation links |
| Footer.tsx | Tagline, legal links, copyright |
| Index.tsx | Hero: tagline, title, subtitle, CTA, Featured, View All, Brand quote |
| Shop.tsx | Collection, Shop All, No products |
| ProductPage.tsx | Add to Cart, Sold Out, Ready to ship, Gallery, Size chart link |
| CartDrawer.tsx | Shopping Cart, empty state, Total, Checkout |
| About.tsx | Full page content |
| Contact.tsx | Form labels, placeholders, button |
| Privacy.tsx | Full page content |
| Terms.tsx | Full page content |
| ProblemSolutionSection.tsx | Title and description |
| DescriptionAccordion.tsx | Loading skeleton (no static text) |

**NOT translated (as requested):**
- StaticReviewsSection.tsx - reviews stay in original language

---

## Technical Details

### i18n Configuration
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, ru },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });
```

### Translation Hook Usage
```typescript
// In ProductPage.tsx
const { translatedHtml, isTranslating } = useTranslatedDescription(
  product.descriptionHtml
);

<DescriptionAccordion 
  descriptionHtml={translatedHtml}
  isTranslating={isTranslating}
/>
```

### Component Translation Pattern
```typescript
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  
  const navLinks = [
    { name: t('nav.shop'), path: "/shop" },
    { name: t('nav.about'), path: "/about" },
    { name: t('nav.contact'), path: "/contact" },
  ];
  // ...
};
```

---

## User Experience

1. **First visit**: Site detects browser language (ru-RU shows Russian, anything else shows English)
2. **Manual switch**: Click floating button to toggle language
3. **Preference saved**: Next visit remembers chosen language
4. **Product descriptions**: Translated on-the-fly when viewing in Russian
5. **Translation loading**: Shows skeleton while translating, then smooth fade-in
6. **Reviews**: Always shown in original language (English)

---

## Notes

- Product **titles** from Shopify remain in original language (would require Shopify multi-language setup)
- Only **descriptions** are translated via AI
- Translation is **cached** so same description isn't translated twice
- Edge function uses **Lovable AI** - no external API keys needed

