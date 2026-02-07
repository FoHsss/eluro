

# План: Отображение "старой" перечёркнутой цены со скидкой 30%

## Что будет сделано

Рядом с текущей ценой добавится "старая" цена, увеличенная на 30%, которая будет перечёркнута. Это создаст визуальное впечатление скидки.

## Как это будет выглядеть

```
Было:
EUR 148.00

Станет:
EUR 192.40  EUR 148.00
 ─────────  (обычная цена)
(перечёркнуто)
```

## Технические детали

**Файл:** `src/pages/ProductPage.tsx` (строки 305-307)

### Текущий код:
```tsx
<p className="text-base text-muted-foreground">
  {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
</p>
```

### Новый код:
```tsx
<p className="text-base text-muted-foreground flex items-center gap-2">
  <span className="line-through text-muted-foreground/60">
    {price.currencyCode} {(parseFloat(price.amount) * 1.3).toFixed(2)}
  </span>
  <span className="text-foreground font-medium">
    {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
  </span>
</p>
```

## Результат

| Элемент | Стиль |
|---------|-------|
| Старая цена (x1.3) | Серая, перечёркнутая, слева |
| Актуальная цена | Тёмная, обычный шрифт, справа |

---

## По второму вопросу

Да, присылай ссылку на сайт — я скачаю и адаптирую:
- Политику приватности (Privacy Policy)
- Условия использования (Terms of Service)  
- Политику возврата (Returns)
- Политику доставки (Shipping)

Просто вставлю текст с нужными изменениями (название компании, контакты и т.д.).

