

# План: Исправление бага скролла модалки на мобильных устройствах

## Диагностика проблемы

На мобильных устройствах при открытии модалки апсейла происходит следующее:
1. `document.body.style.overflow = 'hidden'` блокирует скролл
2. **НО** страница "прыгает" к началу или ведёт себя странно
3. Это связано с особенностями iOS Safari и мобильных браузеров

### Корневая причина

На мобильных устройствах простое `overflow: hidden` на `body` **недостаточно**:
- iOS Safari игнорирует это свойство при определённых условиях
- Framer Motion `useScroll` продолжает отслеживать позицию
- Sticky-элементы (`sticky top-9` hero) конфликтуют с блокировкой скролла
- Transform-анимации (`contentLiftY`) остаются активными

## Решение

Использовать **полную блокировку скролла** с сохранением позиции:

```tsx
useEffect(() => {
  if (detailProduct) {
    // Сохраняем текущую позицию скролла
    const scrollY = window.scrollY;
    
    // Фиксируем body в текущей позиции
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Восстанавливаем всё обратно
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      
      // Возвращаемся к сохранённой позиции
      window.scrollTo(0, scrollY);
    };
  }
}, [detailProduct]);
```

### Почему это работает

1. **`position: fixed`** — полностью "замораживает" страницу
2. **`top: -scrollY`** — сохраняет визуальную позицию контента
3. **При закрытии** — восстанавливаем scroll position через `window.scrollTo`

## Файл для изменения

| Файл | Изменения |
|------|-----------|
| `src/components/product/MetafieldUpsellSection.tsx` | Заменить простой `overflow: hidden` на полную блокировку с фиксацией позиции |

## Результат

- Модалка открывается **на месте** без прыжков
- Страница за модалкой **не скроллится** и **не "плывёт"**
- При закрытии пользователь остаётся на том же месте
- Работает корректно и на iOS Safari, и на Android Chrome

