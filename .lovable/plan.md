
# Product Page Enhancement Plan

## Overview
Extend the existing product page with new sections that maintain Eluro's calm, supportive, and premium brand identity. All additions will use reassuring language without urgency or aggressive sales tactics.

## Current Page Structure
```text
┌─────────────────────────────────────┐
│           Hero Image                │
├─────────────────────────────────────┤
│  Glass Card (Title + Price)         │
│  Variant Options (Color/Size)       │
│  CTA: Add to Cart                   │
│  Size Chart Link                    │
│  Description                        │
│  Gallery Carousel                   │
├─────────────────────────────────────┤
│  Reviews Section (from DB)          │
└─────────────────────────────────────┘
```

## Proposed New Structure
```text
┌─────────────────────────────────────┐
│           Hero Image                │
├─────────────────────────────────────┤
│  Glass Card (Title + Price)         │
│  Variant Options (Color/Size)       │
│  CTA: Add to Cart                   │
│  Size Chart Link                    │
│  Description                        │
├─────────────────────────────────────┤
│  NEW: Problem → Solution Section    │
├─────────────────────────────────────┤
│  NEW: Product Video/GIF             │
├─────────────────────────────────────┤
│  Gallery Carousel                   │
├─────────────────────────────────────┤
│  Reviews Section (with static EN)   │
├─────────────────────────────────────┤
│  NEW: Duplicate CTA Button          │
├─────────────────────────────────────┤
│  NEW: "Often paired with" Upsell    │
└─────────────────────────────────────┘
```

---

## Section 1: Problem → Solution

A calm, supportive section explaining the everyday situation this product addresses.

**Content example (for the Airtag Leather Collar):**
- **Header**: "A Simple Peace of Mind"
- **Problem (neutral)**: "Pets can sometimes wander. A lost collar tag or faded ID can make a stressful moment even harder."
- **Solution (reassuring)**: "Our leather collar holds an AirTag securely, so you can locate your companion whenever you need to. No alarms, just quiet confidence."

**Design:**
- Soft muted background (`bg-muted/20`)
- Calm iconography (optional: subtle icon like a house or heart)
- Short paragraphs, balanced text
- Framer Motion fade-in animation (consistent with existing sections)

---

## Section 2: Product Video/GIF

A short looping video showing the product in real-life use.

**Requirements:**
- Autoplay, muted, looped
- No text overlays
- Calm pace (slow motion or relaxed movement)
- Rounded corners, subtle shadow

**Implementation:**
- Create a reusable `<ProductVideo>` component
- Accept `src` prop (video URL or local asset)
- Use HTML5 `<video>` tag with `autoPlay`, `muted`, `loop`, `playsInline`
- Graceful fallback if video doesn't load
- Initially use a placeholder video URL (to be replaced with actual product video)

**Design:**
- Container: `rounded-2xl overflow-hidden` with `bg-secondary` fallback
- Subtle border and shadow matching gallery style
- Centered within content container

---

## Section 3: Static Customer Reviews (English)

Since the current `ReviewsSection` fetches from the database (which may be empty or in Russian), we'll add a supplementary section with 4 pre-written static reviews in English.

**Reviews content (calm, natural language):**

1. **Emma T.** ★★★★★
   "Exactly what I was looking for. The leather feels quality, and my cat wears it comfortably all day."

2. **Marcus L.** ★★★★★
   "The AirTag fits perfectly and stays secure. Nice design that matches our home aesthetic."

3. **Sophie R.** ★★★★☆
   "Good craftsmanship. Took a few days for my dog to get used to it, but now he doesn't notice it."

4. **James K.** ★★★★★
   "Simple, well-made, and gives me peace of mind when we're at the park."

**Design:**
- Display before the database reviews section
- Same card styling as existing reviews (`bg-muted/20 rounded-xl border`)
- Star rating component (reuse existing `StarRating`)
- Grid or stacked layout on mobile

---

## Section 4: Duplicate CTA Button

Place a secondary "Add to Cart" button after the reviews section.

**Implementation:**
- Exact same styling as primary CTA (`btn-cta btn-cta-pulse`)
- Same `onClick` handler and disabled states
- Same loading/sold-out states

---

## Section 5: "Often paired with" Upsell

A subtle suggestion for a complementary product.

**Design:**
- **Header**: "Often paired with"
- Show one product only (fetched from Shopify)
- No discounts, no urgency language
- Card style matching existing product cards

**Implementation:**
- Use `useShopifyProducts` hook to fetch products
- Filter out current product, show first different one
- If only 1 product exists (current state), hide this section entirely
- Small, subtle layout - not dominant

---

## Technical Details

### Files to Modify

**`src/pages/ProductPage.tsx`** - Main changes:
1. Add `ProblemSolutionSection` component (inline or imported)
2. Add `ProductVideo` component
3. Add `StaticReviewsSection` component with hardcoded English reviews
4. Add second CTA button after reviews
5. Add `PairedWithSection` for upsell

### New Components (inline in ProductPage for simplicity)

```tsx
// Problem → Solution Section
const ProblemSolutionSection = () => (
  <motion.section ...>
    <h3>A Simple Peace of Mind</h3>
    <p>Pets can sometimes wander...</p>
    <p>Our leather collar holds an AirTag securely...</p>
  </motion.section>
);

// Product Video
const ProductVideo = ({ src }: { src: string }) => (
  <div className="rounded-2xl overflow-hidden...">
    <video autoPlay muted loop playsInline src={src} />
  </div>
);

// Static English Reviews
const StaticReviewsSection = () => (
  <motion.section ...>
    {staticReviews.map(review => <ReviewCard key={...} />)}
  </motion.section>
);

// Paired With Section
const PairedWithSection = ({ products, currentHandle }) => {
  const otherProduct = products.find(p => p.node.handle !== currentHandle);
  if (!otherProduct) return null;
  return <motion.section ...><ProductCard /></motion.section>;
};
```

### Animation Consistency
All new sections will use the same animation pattern:
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-50px" }}
transition={{ duration: 0.5 }}
```

### Spacing & Layout
- Sections separated by `py-8` or `py-10` for calm breathing room
- Content max-width: `max-w-lg` (consistent with existing)
- Border separators where appropriate (`border-t border-border`)

---

## Content Details

### Problem → Solution Copy
```
Header: "A Simple Peace of Mind"

Problem: 
"Pets can sometimes wander. A lost collar tag or faded ID can make 
a stressful moment even harder."

Solution:
"Our leather collar holds an AirTag securely, so you can locate 
your companion whenever you need to. No alarms, just quiet confidence."
```

### Static Reviews (English)
```
1. Emma T. | ★★★★★
   "Exactly what I was looking for. The leather feels quality, 
   and my cat wears it comfortably all day."

2. Marcus L. | ★★★★★
   "The AirTag fits perfectly and stays secure. Nice design 
   that matches our home aesthetic."

3. Sophie R. | ★★★★☆
   "Good craftsmanship. Took a few days for my dog to get used 
   to it, but now he doesn't notice it."

4. James K. | ★★★★★
   "Simple, well-made, and gives me peace of mind when 
   we're at the park."
```

---

## Video Placeholder

Since no product video currently exists in assets, implementation will:
1. Create a placeholder div with text "Video coming soon" if no video URL is provided
2. Accept a `videoUrl` prop that can be updated later
3. Structure supports MP4, WebM, or external video URLs

---

## Summary of Changes

| Section | Type | Location |
|---------|------|----------|
| Problem → Solution | New | After Description |
| Product Video/GIF | New | After Problem → Solution |
| Gallery | Existing | Unchanged |
| Static English Reviews | New | Before DB Reviews |
| DB Reviews (existing) | Existing | Unchanged |
| Secondary CTA | New | After Reviews |
| "Often paired with" | New | End of page |

All additions maintain Eluro's brand values:
- No urgency tactics
- No aggressive language
- Calm, supportive tone
- Premium visual aesthetic
- Consistent animations and styling
