

# План: Описание товара в виде аккордеона

## Обзор
Переделать отображение описания товара с простого текста на интерактивный аккордеон, как на скриншотах. Заголовки секций берутся из жирного текста в Shopify, а полное описание раскрывается при клике.

## Как форматировать текст в Shopify

В редакторе описания товара в Shopify нужно использовать следующий формат:

```text
**Product Highlights**
No Subscription Needed: Works seamlessly with your AirTag without monthly fees.
Apple AirTag Integration: Specially designed pocket to securely hold your AirTag.

**Apple AirTag**
Compatible with Apple AirTag for precise location tracking.

**Materials**
Premium quality cow leather with microfiber lining.

**Shipping & Returns**
Free shipping on orders over $50. 30-day return policy.
```

Жирный текст (`**текст**` или через кнопку Bold) станет заголовком аккордеона, а весь текст до следующего жирного заголовка раскроется при клике.

---

## Технические изменения

### 1. Обновить GraphQL-запрос (src/lib/shopify.ts)

Добавить поле `descriptionHtml` для получения HTML-версии описания:

```typescript
export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml  // <-- добавить
      handle
      ...
    }
  }
`;
```

### 2. Обновить типы (src/lib/shopify.ts)

Добавить поле `descriptionHtml` в интерфейс продукта.

### 3. Создать компонент DescriptionAccordion

Новый компонент `src/components/product/DescriptionAccordion.tsx`:

- Парсит `descriptionHtml` и выделяет секции по жирному тексту (`<strong>`, `<b>`)
- Отображает каждую секцию как элемент аккордеона
- Иконки слева от заголовков (как на фото)
- Стиль "+" справа, который меняется на "-" при открытии

Логика парсинга:
```text
1. Разбить HTML по тегам <strong> или <b>
2. Текст внутри <strong>/<b> = заголовок секции
3. Текст после закрывающего тега до следующего <strong>/<b> = содержимое
4. Каждая пара становится элементом аккордеона
```

### 4. Заменить простой текст на аккордеон (src/pages/ProductPage.tsx)

Вместо:
```tsx
<p className="text-muted-foreground leading-relaxed">
  {product.description}
</p>
```

Использовать:
```tsx
<DescriptionAccordion descriptionHtml={product.descriptionHtml} />
```

---

## Визуальный дизайн (по скриншотам)

- Каждая секция с тонкой разделительной линией снизу
- Иконка слева от заголовка (можно подобрать по ключевым словам: "Materials" = список, "Shipping" = грузовик, и т.д.)
- "+" справа, при открытии становится "-"
- Плавная анимация раскрытия
- Содержимое с отступом и читабельным межстрочным интервалом

---

## Пример результата

```text
┌─────────────────────────────────────────────┐
│ ◉ Product Highlights                      + │
├─────────────────────────────────────────────┤
│ ⚙ Apple AirTag                            + │
├─────────────────────────────────────────────┤
│ ≡ Materials                               + │
├─────────────────────────────────────────────┤
│ 🚚 Shipping & Returns                      + │
└─────────────────────────────────────────────┘
```

При клике на секцию:
```text
┌─────────────────────────────────────────────┐
│ ◉ Product Highlights                      - │
│                                             │
│ No Subscription Needed: Works seamlessly    │
│ with your AirTag without monthly fees.      │
│                                             │
│ Apple AirTag Integration: Specially         │
│ designed pocket to securely hold your...    │
├─────────────────────────────────────────────┤
│ ⚙ Apple AirTag                            + │
...
```

