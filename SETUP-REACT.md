# React + shadcn/ui — инструкция по настройке

Текущий проект — **статический сайт** (`index.html` + CSS + JS).  
React, TypeScript, Tailwind и shadcn/ui **не установлены**.

Spotlight-эффект уже работает на сайте через `spotlight-card.js` (vanilla JS).  
Файл `components/ui/spotlight-card.tsx` — для будущей миграции на React.

---

## Быстрый старт (новый React-проект)

```bash
# 1. Создать Next.js + TypeScript + Tailwind
npx create-next-app@latest portfolio-react --typescript --tailwind --eslint --app --src-dir

cd portfolio-react

# 2. Инициализировать shadcn/ui
npx shadcn@latest init
```

При `shadcn init` выберите:
- **Style:** Default  
- **Base color:** Neutral  
- **CSS variables:** yes  
- **Components path:** `@/components` → физически `src/components/ui`

```bash
# 3. Компонент уже лежит здесь — скопируйте из этого репо:
#    components/ui/spotlight-card.tsx → src/components/ui/spotlight-card.tsx

# 4. Зависимости (React уже есть; lucide — опционально)
npm install
```

---

## Зачем папка `/components/ui`

shadcn хранит UI-примитивы в **`components/ui`**, чтобы:
- CLI мог добавлять и обновлять компоненты (`npx shadcn@latest add button`)
- импорты были единообразны: `@/components/ui/spotlight-card`
- UI отделялся от бизнес-компонентов (`components/hero.tsx`, `components/project-card.tsx`)

Если путь другой — обновите `components.json` → `"ui": "@/components/ui"`.

---

## Использование в React

```tsx
// app/page.tsx или demo.tsx
import { GlowCard } from "@/components/ui/spotlight-card";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-8 bg-neutral-950 p-8">
      <GlowCard glowColor="green" customSize className="w-72 p-6">
        <h3 className="text-lg font-semibold text-white">Лендинги</h3>
        <p className="text-sm text-neutral-400">Сайты с ритмом и смыслом.</p>
      </GlowCard>
    </div>
  );
}
```

### Props `GlowCard`

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `children` | `ReactNode` | — | Контент карточки |
| `glowColor` | `'blue' \| 'purple' \| 'green' \| 'red' \| 'orange'` | `'blue'` | Цвет свечения |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер (если не `customSize`) |
| `customSize` | `boolean` | `false` | Свой размер через `className` / width / height |
| `className` | `string` | `''` | Доп. Tailwind-классы |

**Зависимости:** только `react` (без lucide для этого компонента).

---

## Где использовать на портфолио

| Место | `glowColor` | Почему |
|-------|-------------|--------|
| Карточки «Что я делаю» | `green` | Лаймовый акcent сайта |
| Карточка «Быстрый запуск» | `orange` | Акцентный блок |
| Карточки проектов | `green` | Единый digital-стиль |
| CTA-блок | `green` | Призыв к действию |

**Responsive:** карточки в grid — на мобильных одна колонка, spotlight следует за курсором / тачем.

---

## Текущая интеграция (без React)

На статическом сайте классы `.card` и `.project-card` получают `data-glow` через `spotlight-card.js`.  
Обновите страницу и наведите курсор на карточки в блоках «Что я делаю» и «Проекты».
