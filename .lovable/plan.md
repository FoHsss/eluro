

# План: Редизайн модуля апсейлов — интегрированный выбор вариантов

## Понимание задачи

### Текущее поведение
- Каждый апсейл — отдельная карточка с checkbox и кнопкой "Add"
- Апсейлы добавляются в корзину отдельно
- Нет выбора вариантов (цвета) для апсейла

### Новое поведение
1. **Убрать кнопку "Add"** — достаточно выделения
2. **Показывать варианты апсейла** как изображения в ряд (аналогично выбору цвета основного товара)
3. **Название апсейла = кликабельная ссылка** → открывает лайтбокс с:
   - Увеличенной фотографией выбранного варианта
   - Описанием товара из Shopify
4. **При нажатии Add to Cart** — апсейл добавляется вместе с основным товаром (не отдельно)
5. **Визуальное выделение** выбранного варианта апсейла (ring/border)

---

## Архитектура решения

### Структура данных

Сейчас GraphQL запрос для апсейлов возвращает:
- `images(first: 1)` — только 1 изображение
- `variants` — есть, но без изображений

Нужно расширить запрос:
```graphql
images(first: 10)  # больше изображений для вариантов
description        # описание для лайтбокса
variants {
  image {          # изображение каждого варианта
    url
    altText
  }
}
```

### Логика выбора

```text
┌─────────────────────────────────────────────────────────┐
│  "Add to your order"                                    │
│                                                         │
│  ┌─ Leash ─────────────────────────────────────────┐   │
│  │ [ℹ️ Leash for Large Dogs]  +$29.99              │   │
│  │                                                  │   │
│  │   (○)  (○)  (●)  (○)   ← варианты как кружки   │   │
│  │  Brown Black  Tan Navy   (выбранный = ring)    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─ Collar ────────────────────────────────────────┐   │
│  │ [ℹ️ Collar for Small Dogs]  +$19.99             │   │
│  │                                                  │   │
│  │   (●)  (○)  (○)                                 │   │
│  │   Red  Blue Green                               │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  [ Add to Cart ]  ← добавляет основной + выбранные     │
│                     апсейлы одним нажатием              │
└─────────────────────────────────────────────────────────┘
```

### Лайтбокс описания

При клике на название апсейла:

```text
┌────────────────────────────────────────┐
│                                      ✕ │
│                                        │
│       ┌──────────────────────┐        │
│       │                      │        │
│       │   [Фото варианта]    │        │
│       │      (большое)       │        │
│       │                      │        │
│       └──────────────────────┘        │
│                                        │
│   Leash for Large Dogs                 │
│   +$29.99                              │
│                                        │
│   Premium leather leash designed       │
│   for medium and large dogs...         │
│   (описание из Shopify)                │
│                                        │
└────────────────────────────────────────┘
```

---

## Изменения в GraphQL

### Файл: `src/lib/shopify.ts`

Расширить запрос для upsellProducts:

```graphql
upsellProducts: metafield(namespace: "custom", key: "upsell_products") {
  references(first: 4) {
    edges {
      node {
        ... on Product {
          id
          title
          handle
          description           # ← ДОБАВИТЬ
          priceRange { ... }
          images(first: 10) {   # ← УВЕЛИЧИТЬ с 1 до 10
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price { ... }
                availableForSale
                selectedOptions { ... }
                image {         # ← ДОБАВИТЬ
                  url
                  altText
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

---

## Редизайн компонента MetafieldUpsellSection

### Новый интерфейс

```tsx
interface UpsellSelection {
  productId: string;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
}

interface MetafieldUpsellSectionProps {
  upsellProducts: UpsellProduct[] | null;
  onUpsellChange?: (selections: UpsellSelection[]) => void;
}
```

### Состояние

```tsx
// Выбранные варианты для каждого апсейла: productId → variantId
const [selectedVariants, setSelectedVariants] = useState<Map<string, string>>(new Map());

// Лайтбокс описания
const [detailModalProduct, setDetailModalProduct] = useState<UpsellProduct | null>(null);
```

### Структура JSX

```tsx
<div className="space-y-3">
  {upsellProducts.map((product) => {
    const variants = product.variants.edges.filter(v => v.node.availableForSale);
    const selectedVariantId = selectedVariants.get(product.id);
    const selectedVariant = variants.find(v => v.node.id === selectedVariantId)?.node 
      || variants[0]?.node;
    const isSelected = selectedVariants.has(product.id);
    
    return (
      <div className={`p-3 rounded-xl border ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50'}`}>
        {/* Checkbox + Title (clickable for modal) + Price */}
        <div className="flex items-center gap-3 mb-2">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => toggleProduct(product.id, variants[0]?.node.id)} 
          />
          <button 
            onClick={() => setDetailModalProduct(product)}
            className="flex-1 text-left"
          >
            <span className="font-medium text-sm underline underline-offset-2">
              {product.title}
            </span>
          </button>
          <span className="text-xs text-muted-foreground">
            +{selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount).toFixed(2)}
          </span>
        </div>
        
        {/* Variant Images Row - только если апсейл выбран или всегда? */}
        {variants.length > 1 && (
          <div className="flex gap-2 pl-7">
            {variants.map((variant) => {
              const image = variant.node.image || product.images.edges[0]?.node;
              const isVariantSelected = selectedVariantId === variant.node.id;
              
              return (
                <button
                  key={variant.node.id}
                  onClick={() => selectVariant(product.id, variant.node.id)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    isVariantSelected 
                      ? 'border-primary ring-2 ring-primary/30' 
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <img src={image?.url} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  })}
</div>

{/* Detail Modal */}
<AnimatePresence>
  {detailModalProduct && (
    <motion.div className="fixed inset-0 z-50 bg-black/90 ...">
      {/* Аналогично Size Chart lightbox */}
    </motion.div>
  )}
</AnimatePresence>
```

---

## Интеграция с ProductPage

### Передача выбранных апсейлов

ProductPage будет хранить состояние выбранных апсейлов:

```tsx
const [selectedUpsells, setSelectedUpsells] = useState<UpsellSelection[]>([]);

<MetafieldUpsellSection 
  upsellProducts={...}
  onUpsellChange={setSelectedUpsells}
/>
```

### Модификация handleAddToCart

При нажатии "Add to Cart":
1. Добавить основной товар
2. Добавить все выбранные апсейлы

```tsx
const handleAddToCart = async () => {
  if (!product || !selectedVariant) return;

  if (isAlreadyInCart) {
    openCart();
    return;
  }

  // 1. Добавить основной товар
  await addItem({
    product: { node: product },
    variantId: selectedVariant.id,
    ...
  });

  // 2. Добавить выбранные апсейлы
  for (const upsell of selectedUpsells) {
    await addItem({
      product: { node: findUpsellProduct(upsell.productId) },
      variantId: upsell.variantId,
      variantTitle: upsell.variantTitle,
      price: upsell.price,
      quantity: 1,
      selectedOptions: upsell.selectedOptions,
    });
  }

  toast.success("Added to cart", {
    description: selectedUpsells.length > 0 
      ? `${product.title} + ${selectedUpsells.length} item(s)` 
      : product.title,
  });
};
```

---

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/lib/shopify.ts` | Расширить GraphQL запрос: `description`, `images(first: 10)`, `variant.image` |
| `src/components/product/MetafieldUpsellSection.tsx` | Полный редизайн: убрать кнопку Add, добавить выбор вариантов, добавить лайтбокс |
| `src/pages/ProductPage.tsx` | Интегрировать выбранные апсейлы в handleAddToCart |
| `src/i18n/locales/en.json` | Добавить переводы для нового UI |
| `src/i18n/locales/ru.json` | Добавить переводы для нового UI |

---

## Новые ключи локализации

```json
{
  "upsell": {
    "addToOrder": "Add to your order",
    "viewDetails": "View details",
    "included": "Included with your order"
  }
}
```

---

## Визуальная схема финального результата

```text
┌─────────────────────────────────────────────────────────┐
│  Color: [Brown] [Black] [Tan]                           │
│  Size:  [S] [M] [L] [XL]                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ╭─ ADD TO YOUR ORDER ─────────────────────────────────╮│
│  │                                                     ││
│  │  ☑ Matching Leash                    +USD 29.99    ││
│  │     ↳ название = ссылка на описание                ││
│  │                                                     ││
│  │     ◯     ◯     ●     ◯                            ││
│  │    Brown Black  Tan  Navy                          ││
│  │                                                     ││
│  ╰─────────────────────────────────────────────────────╯│
│                                                         │
│         ┌─────────────────────────┐                     │
│         │      Add to Cart        │ ← добавляет        │
│         └─────────────────────────┘   ошейник + поводок│
│                                                         │
│  Please measure your pet's neck...                      │
└─────────────────────────────────────────────────────────┘
```

