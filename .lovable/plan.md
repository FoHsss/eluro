

# План: Info Bar фиксированный + Header прячется при скролле

## Что нужно
- **Info bar**: `fixed top-0` — всегда виден наверху
- **Header**: под info bar, но **уходит вверх** при прокрутке

---

## Визуальная схема

```text
Начальное состояние:
┌────────────────────────────────────┐
│  Currently available at... (fixed) │  ← z-50, top-0, ВСЕГДА виден
├────────────────────────────────────┤
│           Header (Eluro)           │  ← top-9, уходит при скролле
├────────────────────────────────────┤
│         Page Content               │
└────────────────────────────────────┘

После прокрутки:
┌────────────────────────────────────┐
│  Currently available at... (fixed) │  ← остаётся на месте
├────────────────────────────────────┤
│         Page Content               │  ← Header ушёл вверх
└────────────────────────────────────┘
```

---

## Изменения

### 1. `src/components/Header.tsx`

**Было:**
```tsx
className={`fixed top-0 left-0 right-0 z-50 h-16 ...`}
```

**Станет:**
```tsx
className="relative z-40 h-16 bg-background/95 backdrop-blur-sm"
```

- Убираем `fixed` — Header становится частью потока документа
- Убираем `top-0` — позиция определяется потоком
- `z-40` — ниже info bar (`z-50`)

---

### 2. `src/components/Layout.tsx`

**Станет:**
```tsx
import Header from "./Header";

<div className="min-h-screen flex flex-col">
  <PremiumInfoBar />
  <Header />
  <main className="flex-1">
    {children}
  </main>
  <Footer />
  <LanguageSwitcher />
</div>
```

- Возвращаем `<Header />`
- `pt-9` на main больше не нужен — padding создаётся самим Header
- Порядок: PremiumInfoBar (fixed) → Header (в потоке) → main

---

### 3. `src/components/product/PremiumInfoBar.tsx`

Остаётся как есть:
```tsx
className="fixed top-0 left-0 right-0 z-50 h-9 ..."
```

---

## Как это работает

1. **Info bar** — `fixed top-0 z-50`, всегда прикреплён к верху экрана
2. **Header** — обычный элемент в потоке, идёт сразу после info bar
3. При прокрутке Header уходит вверх вместе с контентом, а info bar остаётся на месте
4. `pt-9` на `<main>` убирается — теперь контент идёт сразу после Header

---

## Файлы для изменения

| Файл | Изменение |
|------|-----------|
| `src/components/Header.tsx` | Убрать `fixed top-0`, сделать `relative` |
| `src/components/Layout.tsx` | Вернуть `<Header />`, убрать `pt-9` с main |

