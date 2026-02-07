

# План: Исправление фильтра апсейлов + Уникальные отзывы для товаров

## Найденные проблемы

### Проблема 1: Фильтр по тегу `upsell-only`

Возможные причины:
1. **Кэширование**: Данные могут быть закэшированы до добавления тега
2. **Формат тега**: В Shopify Admin тег может иметь пробел или другое написание

Проверил товар "Leather Leash" — тег `"tags": "upsell-only"` установлен корректно.

Проверю работу фильтра и добавлю отладку.

### Проблема 2: Отзывы дублируются

**Причина**: В `StaticReviewsSection.tsx` используется массив `staticReviews` — это **один и тот же** захардкоженный список из 4 отзывов, который показывается на ВСЕХ товарах одинаково.

```tsx
const staticReviews: StaticReview[] = [
  { id: "1", author: "Emma T.", ... },
  { id: "2", author: "Marcus L.", ... },
  // одинаковые для всех товаров!
];
```

---

## Решение

### Часть 1: Исправить фильтр апсейлов

**Шаг 1**: Добавить `console.log` для отладки данных тегов (временно)

**Шаг 2**: Убедиться, что Storefront API возвращает теги — если нет, проблема в GraphQL запросе

**Шаг 3**: Нормализовать проверку тега (учесть разные форматы):
```tsx
.filter(product => {
  const tags = product.node.tags || [];
  // Проверяем и массив, и строку (на всякий случай)
  const tagsArray = Array.isArray(tags) ? tags : [tags];
  return !tagsArray.some(tag => tag.toLowerCase().includes('upsell-only'));
})
```

### Часть 2: Уникальные отзывы для каждого товара

**Новая архитектура**: Вместо единого массива `staticReviews` — использовать маппинг `productHandle → reviews[]`

**Шаг 1**: Создать объект с отзывами по handle товара:
```tsx
const reviewsByProduct: Record<string, StaticReview[]> = {
  'airtag-leather-collar': [
    { id: "c1", author: "Emma T.", rating: 5, comment: "Perfect collar for my cat...", date: "February 1, 2026" },
    { id: "c2", author: "Marcus L.", rating: 5, comment: "AirTag fits perfectly...", date: "January 18, 2026" },
    // отзывы специфичные для ошейника
  ],
  'leather-leash-handle': [
    { id: "l1", author: "Sophie R.", rating: 4, comment: "Great leash quality...", date: "December 5, 2025" },
    // отзывы специфичные для поводка
  ],
  // 'default' для новых товаров без отзывов
};
```

**Шаг 2**: В компоненте получать отзывы по handle:
```tsx
export const StaticReviewsSection = ({ productHandle = "default" }: StaticReviewsSectionProps) => {
  // Получаем отзывы для конкретного товара или пустой массив
  const productReviews = reviewsByProduct[productHandle] || [];
  
  // Если отзывов нет — показываем только форму
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : 0;
  
  // ...
};
```

**Шаг 3**: Для новых товаров (без захардкоженных отзывов) — показывать:
- Кнопку "Write a Review"
- Текст "No reviews yet. Be the first!"
- НЕ копировать отзывы с других товаров

---

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/pages/Shop.tsx` | Улучшить фильтр тегов с нормализацией |
| `src/components/product/StaticReviewsSection.tsx` | Маппинг отзывов по `productHandle`, пустое состояние для новых товаров |

---

## Визуальное сравнение

### До (текущее):
```
Ошейник:           Поводок:
├─ Emma T. ⭐⭐⭐⭐⭐     ├─ Emma T. ⭐⭐⭐⭐⭐  (дубликат!)
├─ Marcus L. ⭐⭐⭐⭐⭐   ├─ Marcus L. ⭐⭐⭐⭐⭐ (дубликат!)
├─ Sophie R. ⭐⭐⭐⭐     ├─ Sophie R. ⭐⭐⭐⭐   (дубликат!)
└─ James K. ⭐⭐⭐⭐⭐    └─ James K. ⭐⭐⭐⭐⭐  (дубликат!)
```

### После:
```
Ошейник:               Поводок:
├─ Emma T. ⭐⭐⭐⭐⭐       ─────────────────────
├─ Marcus L. ⭐⭐⭐⭐⭐     "No reviews yet."
├─ Sophie R. ⭐⭐⭐⭐       [Write a Review]
└─ James K. ⭐⭐⭐⭐⭐      ─────────────────────
                        (уникальные для товара)
```

---

## Технические детали

### Фильтр тегов (надёжная версия):
```tsx
const visibleProducts = products.filter(product => {
  const tags = product.node.tags;
  if (!tags) return true;
  
  // Обработка и массива, и строки
  const tagList = Array.isArray(tags) 
    ? tags 
    : typeof tags === 'string' 
      ? tags.split(',').map(t => t.trim()) 
      : [];
  
  return !tagList.some(tag => 
    tag.toLowerCase() === 'upsell-only'
  );
});
```

### Структура отзывов по товарам:
```tsx
const reviewsByProduct: Record<string, StaticReview[]> = {
  // Используем handle товара как ключ
  'airtag-leather-collar': [
    { id: "col-1", author: "Emma T.", rating: 5, 
      comment: "Exactly what I was looking for. The leather feels quality, and my cat wears it comfortably all day.", 
      date: "February 1, 2026" },
    { id: "col-2", author: "Marcus L.", rating: 5, 
      comment: "The AirTag fits perfectly and stays secure. Nice design that matches our home aesthetic.", 
      date: "January 18, 2026" },
    { id: "col-3", author: "Sophie R.", rating: 4, 
      comment: "Good craftsmanship. Took a few days for my dog to get used to it, but now he doesn't notice it.", 
      date: "December 5, 2025" },
    { id: "col-4", author: "James K.", rating: 5, 
      comment: "Simple, well-made, and gives me peace of mind when we're at the park.", 
      date: "November 22, 2025" },
  ],
  // Для поводка пока пусто — будет "No reviews yet"
};
```

### Пустое состояние:
```tsx
{productReviews.length === 0 ? (
  <p className="text-center text-muted-foreground py-8">
    No reviews yet. Be the first to share your experience!
  </p>
) : (
  // показать отзывы
)}
```

