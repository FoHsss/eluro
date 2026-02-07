
# План: Info Bar как отдельный прокручиваемый элемент

## Текущее поведение
- Info bar: `fixed top-16` — прикреплён под шапкой, всегда виден
- Шапка: `fixed top-0` — всегда наверху

## Новое поведение
Info bar становится **частью потока страницы** и прокручивается вместе с контентом, отдельно от шапки.

---

## Изменения

### 1. `src/components/product/PremiumInfoBar.tsx`

**Было:**
```tsx
className="fixed top-16 left-0 right-0 z-40 h-9 ..."
```

**Станет:**
```tsx
className="w-full h-9 flex items-center justify-center bg-[hsl(40,20%,94%)] ..."
```

Убираем `fixed`, `top-16`, `z-40` — элемент становится обычным блоком в потоке документа.

---

### 2. `src/components/Layout.tsx`

**Было:**
```tsx
<Header />
<PremiumInfoBar />
<main className="flex-1 pt-[100px]">{children}</main>
```

**Станет:**
```tsx
<Header />
<main className="flex-1 pt-16">
  <PremiumInfoBar />
  {children}
</main>
```

- Info bar перемещается внутрь `<main>`
- Padding уменьшается до `pt-16` (только под шапку)
- Info bar прокручивается вместе с контентом

---

## Визуальная схема

```text
┌────────────────────────────────────┐
│           Header (fixed)           │  ← остаётся фиксированным
└────────────────────────────────────┘
┌────────────────────────────────────┐
│     Currently available at...      │  ← прокручивается с контентом
├────────────────────────────────────┤
│                                    │
│         Page Content               │
│                                    │
└────────────────────────────────────┘
```

При прокрутке info bar уходит вверх вместе с остальным контентом, а шапка с брендом остаётся на месте.

---

## Файлы для изменения

| Файл | Изменение |
|------|-----------|
| `src/components/product/PremiumInfoBar.tsx` | Убрать `fixed`, `top-16`, `z-40` |
| `src/components/Layout.tsx` | Переместить info bar внутрь main, изменить padding |
