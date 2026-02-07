

# План: Индивидуальные апсейлы из Shopify Metafields

## Понимание задачи

Ты хочешь:
- Для каждого товара настраивать **свои уникальные апсейлы** (не общие товары магазина)
- Управлять этим **через Shopify админку** (не в коде)
- Модуль появляется **перед или после кнопки Add to Cart**
- Пример: для ошейника → апсейл поводка, для LED-ошейника → апсейл батарейки

---

## Как это работает в Shopify

### Решение: Metafields с Product Reference

Shopify позволяет создать **metafield** (мета-поле) типа `list.product_reference` — это список ссылок на другие товары. Для каждого товара ты сможешь выбрать 1-4 товара для апсейла прямо в админке Shopify.

```text
Shopify Admin → Products → Airtag Collar → Metafields
┌─────────────────────────────────────────┐
│  Upsell Products:                       │
│  ┌─────────────────────────────────┐    │
│  │ + LED Dog Collar                │ ✕  │
│  │ + Leather Leash                 │ ✕  │
│  └─────────────────────────────────┘    │
│  [+ Add product]                        │
└─────────────────────────────────────────┘
```

---

## Шаги реализации

### Шаг 1: Создать Metafield Definition в Shopify

Нужно создать определение мета-поля для товаров:

| Параметр | Значение |
|----------|----------|
| Namespace | `custom` |
| Key | `upsell_products` |
| Type | `list.product_reference` |
| Name | "Upsell Products" |
| Owner | Product |
| Storefront Access | PUBLIC_READ (обязательно!) |

Это делается один раз через:
- **Shopify Admin** → Settings → Custom data → Products → Add definition
- Или через GraphQL Admin API

### Шаг 2: Заполнить апсейлы для товаров

После создания мета-поля, для каждого товара в Shopify Admin:

1. Открыть товар (например, Airtag Collar)
2. Прокрутить вниз до секции Metafields
3. В поле "Upsell Products" добавить товары-апсейлы
4. Сохранить

### Шаг 3: Обновить GraphQL запрос

Расширить `PRODUCT_BY_HANDLE_QUERY` для получения мета-поля:

```graphql
query GetProductByHandle($handle: String!) {
  product(handle: $handle) {
    # ... существующие поля ...
    
    # Получаем апсейлы из метаполя
    upsellProducts: metafield(namespace: "custom", key: "upsell_products") {
      references(first: 4) {
        edges {
          node {
            ... on Product {
              id
              title
              handle
              priceRange { minVariantPrice { amount currencyCode } }
              images(first: 1) { edges { node { url altText } } }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price { amount currencyCode }
                    availableForSale
                    selectedOptions { name value }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Шаг 4: Создать компонент MetafieldUpsellSection

Новый компонент, который:
- Получает апсейлы из `product.upsellProducts`
- Показывает их **перед кнопкой Add to Cart**
- Позволяет добавить в корзину одним кликом
- Если апсейлов нет — ничего не показывает

---

## Расположение на странице

```text
┌──────────────────────────────────────┐
│         [Hero Image]                 │
├──────────────────────────────────────┤
│  Airtag Leather Collar               │
│  USD 69.99                           │
├──────────────────────────────────────┤
│  Color: [Black] [Brown] [Tan]        │
│  Size:  [S] [M] [L] [XL]             │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ + Add Matching Leash           │  │  ← UPSELL MODULE
│  │   USD 49.99    [+ Add]         │  │     (из metafield)
│  └────────────────────────────────┘  │
│                                      │
├──────────────────────────────────────┤
│       [ Add to Cart ]                │  ← CTA
├──────────────────────────────────────┤
│         Description...               │
└──────────────────────────────────────┘
```

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `src/lib/shopify.ts` | Обновить `PRODUCT_BY_HANDLE_QUERY` для получения upsell metafield |
| `src/components/product/MetafieldUpsellSection.tsx` | Создать новый компонент |
| `src/components/product/index.ts` | Экспортировать новый компонент |
| `src/pages/ProductPage.tsx` | Добавить модуль перед CTA кнопкой |
| `src/i18n/locales/*.json` | Добавить переводы для нового модуля |

---

## Что тебе нужно сделать в Shopify Admin

1. **Создать metafield definition:**
   - Settings → Custom data → Products → Add definition
   - Name: "Upsell Products"
   - Namespace and key: `custom.upsell_products`
   - Type: Product reference (List)
   - Обязательно: включить "Storefront API access"

2. **Заполнить для каждого товара:**
   - Открыть товар → Metafields → Upsell Products
   - Добавить 1-4 товара

---

## Дизайн модуля

Компактная карточка апсейла:

```text
┌─────────────────────────────────────────┐
│  🔗 Add to your order                   │
├─────────────────────────────────────────┤
│  ┌────┐  Matching Leather Leash         │
│  │foto│  USD 49.99                      │
│  └────┘  ☑ Add for USD 49.99            │
└─────────────────────────────────────────┘
```

Или с чекбоксом:
- Когда пользователь нажимает Add to Cart главного товара
- Если чекбокс включён — апсейл добавляется вместе с ним

---

## Преимущества этого подхода

1. **Управление из Shopify** — не нужно менять код для каждого товара
2. **Гибкость** — разные апсейлы для разных товаров
3. **Масштабируемость** — работает для любого количества товаров
4. **Синхронизация** — цены/наличие актуальны автоматически

