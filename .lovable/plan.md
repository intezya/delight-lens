
# AI Review Intelligence — Frontend Plan

Современный B2B SaaS интерфейс для анализа клиентских отзывов и AI-генерации гипотез. Mock-данные, без backend.

## Структура навигации

Левый sidebar (collapsible) + верхний бар с глобальными фильтрами (период, источник, бренд/категория, сегмент) и сохранёнными представлениями.

Разделы:
- **Dashboard** — `/`
- **Reviews** — `/reviews`
- **Insights** — `/insights`
- **Topics** — `/topics` + `/topics/$topicId`
- **Impact** — `/impact`
- **Settings** — `/settings`

## Визуальный язык

- Чистый light-режим + опциональный dark, мягкая нейтральная палитра (slate/zinc) с акцентами:
  - **Negative / risk** — приглушённый красно-коралловый
  - **Positive / delight** — приглушённый изумрудный
  - **Mixed** — амбер
  - **AI / insight** — фиолетово-индиго акцент
- Сильная типографика (крупные числа KPI, тонкие подписи, моно для метрик)
- Карточки с мягкими тенями, тонкими бордерами, скруглением 12–16px
- Recharts для графиков (line, area, bar, stacked, donut, heatmap)
- Чёткое визуальное разделение: **Risks · Problems · Opportunities · Strengths**

## Экран 1 — Dashboard (`/`)

Заголовок + период-пикер + сравнение с предыдущим периодом.

**Ряд KPI-карточек (2 строки по 4–5):**
- Всего отзывов (с дельтой)
- Sentiment Index (—100…+100, спарклайн)
- Инсайтов за период
- Сильных инсайтов в работе
- Конверсия insight → action (%)
- Доля повторных проблем (%)
- Δ Sentiment после внедрений
- Средняя оценка по площадкам

**Аналитический грид:**
- Динамика отзывов по времени (stacked area: pos/neg/mixed)
- Динамика тональности (line + threshold)
- Распределение тем (horizontal bar, top 10)
- Вклад тем в негатив vs позитив (diverging bar)
- Повторяющиеся проблемы (список с badge "повтор ×N")
- Рост сильных сторон (mini cards с трендом)
- Средняя оценка по площадкам (multi-line: Я.Маркет, Otzovik, 2GIS, Google)
- Последние сильные AI-инсайты (3–4 карточки с CTA)
- Аномалии / всплески по темам (alert-list со spike-индикатором)

## Экран 2 — Reviews (`/reviews`)

- Toolbar: поиск, переключатель **Table / Cards**, группировка (тема/тональность/источник/период), кнопка фильтров
- Боковая панель фильтров (collapsible): тональность, темы (multi), источник, период, приоритет, "только повторяющиеся", "связан с известной проблемой"
- **Table view**: текст (truncate), дата, источник (с лого), sentiment-pill, темы (chips), сила сигнала (bar), повтор (badge), приоритет, связь
- **Card view**: цитата крупно, метаданные внизу, цветная левая полоса по тональности
- **Side drawer** при клике: полный текст, разбор AI (темы, аспекты, эмоции), похожие отзывы, связанные инсайты, действия (отметить, передать в инсайт)
- Highlight повторяющихся сценариев — кластерный бейдж

## Экран 3 — Insights (`/insights`)

- Доска с фильтрами по статусу: **New · Validated · In progress · Implemented · Rejected** (табы или kanban-toggle)
- Карточка гипотезы:
  - AI-бейдж + заголовок
  - Описание, тема, тип влияния (icon: ↓neg / ↑pos / ↓repeat / ↑sat / ↑rating)
  - Метрики: confidence (progress bar), сила сигнала, ожидаемый эффект, приоритет
  - Footer: владелец/команда (avatar), дата, N связанных отзывов
  - Actions: Confirm · Reject · Move to work · Mark implemented · View reviews · View impact
- Detail view (drawer/route): полное обоснование, evidence (отзывы-источники), связанные действия, график "до/после"

## Экран 4 — Topic detail (`/topics/$topicId`)

Шапка с названием темы, классификацией (risk/opportunity/strength), summary AI.

- Динамика темы во времени (area + sentiment overlay)
- Donut: pos/neg/mixed внутри темы
- Repeat-patterns (список паттернов с частотой)
- Связанные AI-гипотезы (мини-карточки)
- Принятые действия + эффект (timeline)
- Сегменты, где встречается чаще (bar by region/category)
- Ключевые цитаты (карусель quote-cards)
- Список связанных отзывов (компактная таблица)

Также `/topics` — обзорный список всех тем с типом, объёмом, sentiment, трендом.

## Экран 5 — Impact (`/impact`)

- KPI: Δ sentiment overall, # внедрённых гипотез, средний эффект, ROI-стиль
- Таблица гипотез в работе → действие → метрики до/после (sparkline до/после, дельта зелёным/красным)
- Before/After графики по выбранной гипотезе (split view)
- Снижение повторяемости (bar chart по темам)
- Изменение средней оценки по площадкам (line с метками деплоев)
- Таймлайн внедрений с маркерами на графике sentiment

## Экран 6 — Settings

Источники (подключения), команда, теги/категории, AI-настройки (порог confidence), уведомления.

## Mock-данные

Реалистичные RU-отзывы (примеры из брифа), 17 категорий из брифа, источники: Я.Маркет, Otzovik, 2GIS, Google Maps, Trustpilot, App Store. Сегменты: регион, категория товара, бренд. Временные ряды на 90 дней.

## Состояния

Empty, loading (skeletons), error, hover (подсветка строк/точек графика), tooltips на всех метриках с пояснением методики.

## Компоненты (переиспользуемые)

`KpiCard`, `SentimentPill`, `TopicChip`, `SignalBar`, `ConfidenceBar`, `InsightCard`, `ReviewRow`, `ReviewCard`, `ReviewDrawer`, `FilterPanel`, `GlobalFiltersBar`, `AppSidebar`, `PeriodPicker`, `TrendSparkline`, `BeforeAfterChart`, `AnomalyAlert`, `QuoteCard`, `EmptyState`, `SectionHeader`.

## Технически

TanStack Start routes, Tailwind v4 + shadcn (sidebar, card, tabs, table, drawer, dialog, badge, tooltip, select, popover, command), Recharts, lucide-react. Mock-данные в `src/lib/mock/`. Все цвета через semantic tokens в `styles.css` (sentiment-positive/negative/mixed, risk, opportunity, ai-accent).
