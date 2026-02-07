

# План: Info Bar фиксированный наверху БЕЗ Header

## Что вы хотите
- Info bar: **фиксированный в самом верху** (`fixed top-0`)
- Header: **убрать совсем** или сделать не фиксированным
- Info bar остаётся видимым при прокрутке

## Что я сделал неправильно
Я убрал фиксацию с info bar, сделав его частью потока. Нужно наоборот — вернуть фиксацию info bar и убрать Header.

---

## Изменения

### 1. `src/components/product/PremiumInfoBar.tsx`

**Станет:**
```tsx
className="fixed top-0 left-0 right-0 z-50 h-9 flex items-center justify-center bg-[hsl(40,20%,94%)] ..."
```

Info bar фиксируется в самом верху экрана (`top-0`).

---

### 2. `src/components/Layout.tsx`

**Станет:**
```tsx
<div className="min-h-screen flex flex-col">
  <PremiumInfoBar />
  {/* Header убран */}
  <main className="flex-1 pt-9">
    {children}
  </main>
  <Footer />
  <LanguageSwitcher />
</div>
```

- Header убирается из Layout
- Padding main уменьшается до `pt-9` (только высота info bar)

---

## Визуальная схема

```text
┌────────────────────────────────────┐
│  Currently available at... (fixed) │  ← z-50, top-0, всегда виден
└────────────────────────────────────┘
┌────────────────────────────────────┐
│                                    │
│         Page Content               │  ← прокручивается под info bar
│                                    │
└────────────────────────────────────┘
```

---

## Файлы для изменения

| Файл | Изменение |
|------|-----------|
| `src/components/product/PremiumInfoBar.tsx` | Добавить `fixed top-0 left-0 right-0 z-50` |
| `src/components/Layout.tsx` | Убрать `<Header />`, изменить padding на `pt-9` |

