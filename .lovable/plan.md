
# План: Динамическое скрытие/показ hero-фото при скролле

## Проблема

Текущая реализация использует "защёлку" (latch):
- Как только `hasReachedReviews` становится `true`, оно **никогда** не возвращается в `false`
- Поэтому при скролле обратно вверх hero-фото остаётся скрытым навсегда

## Решение

Заменить "защёлку" на **динамическую проверку** позиции скролла:
- Если пользователь **выше** отзывов → hero виден
- Если пользователь **ниже** отзывов → hero скрыт

Это даст правильное поведение:
1. Скролл вниз до отзывов → hero плавно исчезает
2. Скролл дальше к футеру → hero остаётся скрытым (не просвечивает)
3. Скролл обратно вверх → hero снова появляется

## Изменения в коде

Файл: `src/pages/ProductPage.tsx`

### Было (строки 39-65):
```tsx
// Scroll-based latch: once reviews are reached, hero is hidden forever
const [hasReachedReviews, setHasReachedReviews] = useState(false);

useEffect(() => {
  if (!isMobile) return;
  
  const handleScroll = () => {
    // Once latched, never unlatch  ← ЭТО ПРОБЛЕМА
    if (hasReachedReviews) return;
    // ...
  };
  // ...
}, [isMobile, hasReachedReviews]);
```

### Станет:
```tsx
// Dynamic scroll check: hero visible above reviews, hidden below
const [isAboveReviews, setIsAboveReviews] = useState(true);

useEffect(() => {
  if (!isMobile) return;
  
  const handleScroll = () => {
    const anchor = reviewsAnchorRef.current;
    if (!anchor) return;
    
    // Trigger point: when reviews are ~35% from bottom of viewport
    const triggerY = anchor.offsetTop - window.innerHeight * 0.35;
    
    // Dynamically update based on current scroll position
    setIsAboveReviews(window.scrollY < triggerY);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check immediately
  
  return () => window.removeEventListener('scroll', handleScroll);
}, [isMobile]); // Removed hasReachedReviews from deps
```

### Обновить зависимые переменные:
```tsx
// Было:
const isHeroSticky = isMobile && !hasReachedReviews;

// Станет:
const isHeroSticky = isMobile && isAboveReviews;
```

### Обновить анимации и классы:
Везде где было `hasReachedReviews` заменить на `!isAboveReviews`:
- `opacity: isMobile && !isAboveReviews ? 0 : 1`
- `bg-background` / `bg-secondary` условие
- `pointer-events-none` условие

## Визуальный результат

```text
Скролл вверху:
┌────────────────┐
│  Hero 100%     │ ← виден, sticky
├────────────────┤
│  Content...    │

Скролл до отзывов:
┌────────────────┐
│  Hero → 0%     │ ← плавно исчезает
├────────────────┤
│  Reviews       │

Скролл до футера:
┌────────────────┐
│  (hero скрыт)  │ ← НЕ просвечивает
├────────────────┤
│  Footer        │

Скролл обратно вверх:
┌────────────────┐
│  Hero ← 100%   │ ← снова появляется!
├────────────────┤
│  Content...    │
```

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/pages/ProductPage.tsx` | Заменить "latch" логику на динамическую проверку `isAboveReviews` |
