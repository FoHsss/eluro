
# Plan: Polish Language + Translation Audit + Upsell Modal Fix

## 1. Add Polish Language (PL)

### Files to create:
- **src/i18n/locales/pl.json** -- full Polish translation of all keys (nav, hero, featured, brandQuote, shop, product, cart, about, contact, footer, privacy, terms, urgency, upsell, reviews)

### Files to update:
- **src/i18n/index.ts** -- import `pl` locale, add to resources and supportedLngs
- **src/components/LanguageSwitcher.tsx** -- add `{ code: 'pl', name: 'Polski', flag: '\U0001F1F5\U0001F1F1' }` to the languages array

---

## 2. Translation Audit -- Fix Hardcoded Strings

Found untranslated hardcoded text in these files:

| File | Hardcoded Text | Fix |
|------|---------------|-----|
| `src/pages/ProductPage.tsx` line 170 | `"Added to cart"` | Use `t('upsell.added')` |
| `src/pages/ProductPage.tsx` line 345 | `"Limited stock batch"` | Add key `product.limitedBatch` and use `t()` |
| `src/components/Footer.tsx` line 45 | `"Refund Policy"` | Add key `footer.refund` and use `t()` |
| `src/components/Footer.tsx` line 51 | `"Shipping Policy"` | Add key `footer.shipping` and use `t()` |
| `src/pages/Refund.tsx` line 16 | `"Refund Policy"` (title) | These pages are legal docs; keeping English is standard, but adding i18n keys for titles |
| `src/pages/Shipping.tsx` line 16 | `"Shipping Policy"` (title) | Same as above |

### New translation keys to add to ALL 11 locale files (en + 10 existing + pl):
```
"product.limitedBatch": "Limited stock batch"
"footer.refund": "Refund Policy"  
"footer.shipping": "Shipping Policy"
```

---

## 3. Fix Upsell Detail Modal Positioning

**Problem**: When clicking the product title link in the upsell section, the detail modal "flies to the ceiling" because `body.style.position = 'fixed'` with `top: -scrollY` conflicts with the modal's `fixed inset-0` positioning on mobile (especially with the sticky hero).

**Solution**: Replace the `body.style.position = 'fixed'` scroll-lock approach with a simpler `overflow: hidden` approach, and add `items-start pt-[10vh]` or keep `items-center` but ensure proper safe-area handling:

- **MetafieldUpsellSection.tsx**:
  - Change the scroll-lock effect (lines 76-99) to use `document.body.style.overflow = 'hidden'` instead of `position: fixed` trick
  - This prevents the page jump that causes the modal to appear mispositioned
  - Keep `flex items-center justify-center` on the overlay but ensure it renders properly

---

## Technical Details

### Files to modify:
1. **src/i18n/locales/pl.json** -- CREATE new file with full Polish translations
2. **src/i18n/index.ts** -- add Polish import + config
3. **src/components/LanguageSwitcher.tsx** -- add PL to language list
4. **All 11 locale files** -- add `product.limitedBatch`, `footer.refund`, `footer.shipping`
5. **src/pages/ProductPage.tsx** -- replace hardcoded "Added to cart" and "Limited stock batch" with t()
6. **src/components/Footer.tsx** -- replace hardcoded "Refund Policy" and "Shipping Policy" with t()
7. **src/components/product/MetafieldUpsellSection.tsx** -- fix scroll-lock logic to prevent modal jump
