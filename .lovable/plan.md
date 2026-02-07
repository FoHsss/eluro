

# План: Исправление переводов + Модуль апсейла из Shopify

## Часть 1: Исправление переводов PremiumInfoBar

### Проблема
В PremiumInfoBar используются ключи из секции `urgency`, которые отсутствуют в неанглийских локалях:
- `urgency.curatedEluro`
- `urgency.availabilityDays`
- `urgency.readyToShip`

### Решение
Добавить недостающие ключи во все локали (10 языков).

| Файл | Ключи для добавления |
|------|---------------------|
| `src/i18n/locales/ru.json` | curatedEluro, availabilityDays, readyToShip |
| `src/i18n/locales/de.json` | curatedEluro, availabilityDays, readyToShip |
| `src/i18n/locales/fr.json` | curatedEluro, availabilityDays, readyToShip |
| `src/i18n/locales/es.json` | curatedEluro, availabilityDays, readyToShip |
| `src/i18n/locales/it.json` | curatedEluro, availabilityDays, readyToShip |
| `src/i18n/locales/pt.json` | curatedEluro, availabilityDays, readyToShip |
| `src/i18n/locales/zh.json` | curatedEluro, availabilityDays, readyToShip |
| `src/i18n/locales/ja.json` | curatedEluro, availabilityDays, readyToShip |
| `src/i18n/locales/ko.json` | curatedEluro, availabilityDays, readyToShip |

---

## Часть 2: Модуль апсейла из Shopify

### Текущее состояние
- Компонент `PairedWithSection` уже существует
- Загружает все товары через `useShopifyProducts(10)`
- Показывает один случайный товар (не текущий)
- Нет возможности добавить в корзину напрямую

### Улучшения

**Новый компонент:** `UpsellSection.tsx`

Функционал:
1. Заголовок "Complete the look" / "Дополни образ" (переводимый)
2. Карточка товара из Shopify с:
   - Изображением
   - Названием
   - Ценой
   - Кнопкой "Add to Cart" (без перехода на страницу)
3. Опциональный выбор варианта (если есть опции)
4. Анимация появления

### Структура компонента

```text
┌──────────────────────────────────────┐
│     Complete your order              │  ← переводимый заголовок
├──────────────────────────────────────┤
│  ┌─────────────┐                     │
│  │   [Фото]    │  Collar + Leash Set │
│  │             │  USD 89.99          │
│  │             │                     │
│  └─────────────┘  [ + Add ]          │
└──────────────────────────────────────┘
```

### Данные из Shopify
- Товары загружаются через существующий `useShopifyProducts`
- Фильтрация: исключаем текущий товар по `handle`
- Показываем первый доступный (`availableForSale: true`)

### Файлы для создания/изменения

| Файл | Действие |
|------|----------|
| `src/components/product/UpsellSection.tsx` | Создать новый компонент |
| `src/i18n/locales/*.json` (все 10) | Добавить ключи `upsell.title`, `upsell.addButton` |
| `src/components/product/index.ts` | Экспортировать UpsellSection |
| `src/pages/ProductPage.tsx` | Заменить PairedWithSection на UpsellSection |

### Переводы для апсейла

| Язык | `upsell.title` | `upsell.addButton` |
|------|----------------|-------------------|
| EN | Complete your order | + Add |
| RU | Дополни заказ | + Добавить |
| DE | Vervollständige deine Bestellung | + Hinzufügen |
| FR | Complétez votre commande | + Ajouter |
| ES | Completa tu pedido | + Añadir |
| IT | Completa il tuo ordine | + Aggiungi |
| PT | Complete seu pedido | + Adicionar |
| ZH | 完善您的订单 | + 添加 |
| JA | ご注文を完了する | + 追加 |
| KO | 주문을 완료하세요 | + 추가 |

---

## Технические детали

### UpsellSection.tsx — ключевые моменты

```tsx
// Получаем товары из Shopify
const { products } = useShopifyProducts(10);
const { addItem } = useCartStore();

// Находим другой товар (не текущий)
const upsellProduct = products.find(p => 
  p.node.handle !== currentHandle && 
  p.node.variants.edges.some(v => v.node.availableForSale)
);

// Добавляем в корзину напрямую
const handleQuickAdd = async () => {
  const variant = upsellProduct.node.variants.edges
    .find(v => v.node.availableForSale)?.node;
  
  await addItem({
    product: upsellProduct,
    variantId: variant.id,
    // ...
  });
  
  toast.success("Added to cart");
};
```

### Порядок работы
1. Сначала исправляю переводы PremiumInfoBar (быстро)
2. Создаю UpsellSection с функцией добавления в корзину
3. Добавляю переводы для апсейла
4. Заменяю старый PairedWithSection на новый UpsellSection

