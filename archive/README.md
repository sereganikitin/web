# archive/

Эта папка — вне `src/app/`, поэтому Next.js её не рендерит. Складываем сюда
страницы и компоненты, которые временно убрали с продакшена, но не хочется
терять.

## Содержимое

- **theme-preview.tsx** — страница сравнения 12 акцентных цветов на тёмном
  графитовом фоне (Mint, Indigo, Sky, Coral, Cyan, Lime, Magenta, Teal,
  Slate, Lavender, Salmon, Periwinkle). Использовалась для подбора нового
  акцента вместо золотого.

## Как вернуть страницу обратно

```bash
mkdir src/app/theme-preview
mv archive/theme-preview.tsx src/app/theme-preview/page.tsx
# Закоммитить и запушить — после деплоя страница будет доступна по /theme-preview
```
