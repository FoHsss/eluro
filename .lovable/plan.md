
# ✅ ВЫПОЛНЕНО: Hero-фото исчезает навсегда после отзывов

## Что было сделано

1. **Добавлен `once: true`** в `useInView` — теперь `hasReachedReviews` после первого достижения отзывов остаётся `true` навсегда
2. **Hero-фото плавно растворяется** с blur и scale для мягкого эффекта
3. **Добавлен `pointer-events-none`** — скрытое фото не реагирует на клики
4. **Удалены все спейсеры** — никакого лишнего пространства перед футером

## Ключевые изменения

```tsx
// Было:
const reviewsInView = useInView(reviewsAnchorRef, { margin, amount });
// Стало:
const hasReachedReviews = useInView(reviewsAnchorRef, { margin, amount, once: true });
```

## Результат

- Hero sticky и видно при открытии страницы
- При скролле до отзывов — плавно растворяется (opacity + blur + scale)
- Ниже отзывов и у футера — hero не появляется
- При скролле вверх — hero не возвращается (по выбору пользователя)
