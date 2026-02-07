
# План: Премиальный Sticky Info Bar

## Обзор
Создать спокойный, премиальный информационный бар в верхней части страницы товара. Бар будет фиксированным, с ротацией сообщений и мягкой анимацией.

---

## Дизайн

```text
┌──────────────────────────────────────────────────────┐
│     Currently available at a preferred price         │  ← 36px height
└──────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┐
│                     Header                           │  ← 64px
└──────────────────────────────────────────────────────┘
```

### Визуальные характеристики
- **Высота**: 36px
- **Фон**: теплый бежевый (`hsl(40, 20%, 94%)`) — соответствует бренду Eluro
- **Текст**: приглушённый тёмный с 70% opacity
- **Шрифт**: Sora (brand), regular weight, letter-spacing +0.05em
- **Без иконок, рамок, кнопок**

---

## Сообщения (ротация)

1. "Currently available at a preferred price"
2. "Limited quantity available"
3. "This item is part of a curated Eluro selection"
4. "Availability updates in 2 days"
5. "Thoughtfully chosen, ready to ship"

Смена каждые 5 секунд с плавным fade.

---

## Анимация

### Ротация текста
- **Интервал**: 5 секунд
- **Transition**: fade-out 400ms → fade-in 400ms
- **Easing**: ease-out

### Пульсация opacity
- Тонкая анимация: 0.8 → 1 → 0.8
- **Длительность цикла**: 4 секунды
- **Timing**: синусоидальная кривая

---

## Изменения в файлах

### 1. Новый компонент: `src/components/product/PremiumInfoBar.tsx`

```typescript
// Основные параметры
const messages = [...]; // 5 сообщений
const [currentIndex, setCurrentIndex] = useState(0);
const [isVisible, setIsVisible] = useState(true);

// Ротация каждые 5 секунд
useEffect(() => {
  const interval = setInterval(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
      setIsVisible(true);
    }, 400);
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

### 2. Обновить `src/components/product/index.ts`
Добавить экспорт нового компонента.

### 3. Обновить `src/components/Layout.tsx`
Добавить info bar перед Header (только на страницах товара).

**Альтернатива**: Интегрировать напрямую в `ProductPage.tsx` — проще и не влияет на другие страницы.

### 4. Обновить `src/index.css`
Добавить CSS-переменную для высоты info bar.

### 5. Обновить переводы
Добавить новые ключи в `urgency` секцию всех locale файлов:
- `urgency.curatedEluro` — "This item is part of a curated Eluro selection"
- `urgency.readyToShip` — "Thoughtfully chosen, ready to ship"
- (остальные уже существуют)

### 6. Удалить `CalmUrgency` компонент
Заменяется новым info bar — убрать из ProductPage.

---

## Позиционирование

### Вариант A: Над Header (рекомендуется)
- Info bar: `fixed top-0` с `z-60`
- Header: сдвигается на `top-[36px]`
- Main content: `pt-[100px]` вместо `pt-16`

### Вариант B: Только на странице товара
- Info bar внутри ProductPage, перед hero
- Не затрагивает глобальный Layout
- Проще реализовать

**Выбор: Вариант A** — более заметный, соответствует паттерну Apple/Airbnb.

---

## Адаптивность

- **Mobile**: полная ширина, текст по центру
- **Desktop**: то же самое, можно чуть увеличить высоту (40px)

---

## Структура компонента

```tsx
<motion.div
  className="fixed top-0 left-0 right-0 z-[60] h-9 flex items-center justify-center"
  style={{
    backgroundColor: 'hsl(40, 20%, 94%)',
  }}
  animate={{ opacity: [0.8, 1, 0.8] }}
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
>
  <AnimatePresence mode="wait">
    <motion.p
      key={currentIndex}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="text-xs font-display font-normal tracking-[0.05em] text-foreground/70"
    >
      {messages[currentIndex]}
    </motion.p>
  </AnimatePresence>
</motion.div>
```

---

## Итоговые изменения

| Файл | Действие |
|------|----------|
| `src/components/product/PremiumInfoBar.tsx` | Создать |
| `src/components/product/index.ts` | Добавить экспорт |
| `src/components/Header.tsx` | Сдвинуть на `top-9` |
| `src/components/Layout.tsx` | Добавить PremiumInfoBar |
| `src/index.css` | Добавить переменную высоты |
| `src/pages/ProductPage.tsx` | Удалить CalmUrgency, обновить sticky hero позицию |
| `src/i18n/locales/*.json` | Добавить 2 новых ключа |
| `src/components/product/CalmUrgency.tsx` | Удалить (опционально) |
