

# План: Хедер появляется при скролле вверх + Видео/GIF из галереи товара

## Часть 1: Хедер появляется при скролле вверх

### Текущее поведение
- Хедер имеет `className="relative z-40 h-16 mt-9"` — он статичный и уходит за экран при скролле
- Нет логики для показа/скрытия при скролле вверх

### Решение: "Smart Header" паттерн
Хедер станет **fixed** и будет:
- Скрываться при скролле вниз (чтобы не мешать контенту)
- Появляться при скролле вверх (чтобы дать доступ к корзине)
- Учитывать PremiumInfoBar (36px сверху)

### Логика

```text
scrollY ↓ (скролл вниз)  → Хедер уезжает вверх (translateY: -100%)
scrollY ↑ (скролл вверх) → Хедер появляется (translateY: 0)
```

### Реализация в Header.tsx

```tsx
const [isVisible, setIsVisible] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Показываем хедер при скролле вверх или в самом верху
    if (currentScrollY < lastScrollY || currentScrollY < 50) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    }
    
    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);
```

### Стили

```tsx
<header className={`fixed top-9 left-0 right-0 z-40 h-16 bg-background/95 backdrop-blur-md 
  transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
```

### Важно: Компенсация fixed хедера
Поскольку хедер станет `fixed`, нужно добавить отступ в Layout, чтобы контент не прятался под ним:
- PremiumInfoBar: 36px (top-9)
- Header: 64px (h-16)
- Итого: 100px padding-top для main

---

## Часть 2: Видео/GIF из галереи товара

### Текущее поведение
- `ProductVideo` принимает `src` и `poster`
- В `ProductPage` вызывается без пропсов: `<ProductVideo />`
- Показывает заглушку "Video coming soon"

### Решение
По аналогии с галереей (фильтр по `altText.includes('gallery')`), фильтровать изображения с `altText.includes('gif')` и передавать в ProductVideo.

### Логика

```tsx
// В ProductPage.tsx
const gifMedia = product.images.edges.find(
  img => img.node.altText?.toLowerCase().includes('gif')
);

// Передаём в компонент
<ProductVideo 
  src={gifMedia?.node.url} 
  poster={gifMedia?.node.url}
/>
```

### Обновление ProductVideo.tsx
Поскольку это может быть GIF (изображение), а не MP4 видео, нужно определять тип:

```tsx
interface ProductVideoProps {
  src?: string;
  poster?: string;
}

export const ProductVideo = ({ src, poster }: ProductVideoProps) => {
  // Определяем тип медиа по расширению
  const isGif = src?.toLowerCase().includes('.gif');
  const isVideo = src?.toLowerCase().match(/\.(mp4|webm|mov)$/);
  
  if (!src) {
    return /* placeholder */;
  }
  
  // Для GIF показываем как изображение
  if (isGif || (!isVideo && src)) {
    return (
      <motion.div className="mb-8 rounded-2xl overflow-hidden">
        <img src={src} alt="Product demo" className="w-full" />
      </motion.div>
    );
  }
  
  // Для видео — video tag
  return /* video element */;
};
```

---

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/components/Header.tsx` | Добавить логику скролла вверх/вниз, сделать fixed |
| `src/components/Layout.tsx` | Добавить padding-top для компенсации fixed хедера |
| `src/components/product/ProductVideo.tsx` | Поддержка GIF-изображений, а не только видео |
| `src/pages/ProductPage.tsx` | Фильтровать изображения по 'gif' в altText и передавать в ProductVideo |

---

## Визуальная схема хедера

```text
Скролл вниз:
┌──────────────────────────┐
│ [Premium Info Bar]       │ ← остаётся видимой (fixed top-0)
├──────────────────────────┤
│                          │ ← хедер уехал вверх
│      [Контент]           │
│                          │
└──────────────────────────┘

Скролл вверх:
┌──────────────────────────┐
│ [Premium Info Bar]       │
├──────────────────────────┤
│ [Eluro]  Shop  Cart      │ ← хедер вернулся
├──────────────────────────┤
│      [Контент]           │
└──────────────────────────┘
```

---

## Важные детали

### Для хедера:
- `top-9` (36px) — под PremiumInfoBar
- `backdrop-blur-md` — размытие фона для читаемости
- `transition-transform duration-300` — плавная анимация
- Порог 100px для скрытия (не реагируем на микроскроллы)

### Для GIF/видео:
- Приоритет: ищем `altText` содержащий "gif"
- Если нет — показываем заглушку "Coming soon"
- Поддержка как GIF-изображений, так и MP4 видео

