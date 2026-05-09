## Цель

Сделать гипотезы в продукте «объяснимыми»: пользователь должен сразу понимать, **откуда** взялась цифра, **почему** возникла гипотеза, **на чём** она основана и **что может пойти не так**. Параллельно ввести иерархию «Тема → Подтема → Гипотеза» и пост-трекинг внедрения.

Берём в работу 9 пунктов из «минимального MVP»:
1. Раскрытие confidence
2. Объяснение expected effect
3. Блок «Почему гипотеза появилась»
4. Доказательства-отзывы с подсветкой
5. Риски гипотезы
6. Иерархия «Тема → Подтема → Гипотеза»
7. Статус «Нужны дополнительные данные»
8. Команда-владелец и рекомендованное действие
9. Post-tracking после внедрения

Пункты 9 (Timeline) и 10 (Комментарии) откладываем во вторую очередь, чтобы не размывать фокус.

---

## 1. Расширение мок-модели (`src/lib/mock/data.ts`)

Расширяем тип `Insight` новыми опциональными полями (для существующих гипотез заполним моками):

```ts
type ConfidenceBreakdown = {
  reviewsCount: number;
  reviewsCountScore: number;     // вклад в %
  repeatabilityScore: number;
  sentimentScore: number;
  sourceDiversityScore: number;
  recencyScore: number;
};

type ExpectedEffect = {
  type: "complaints_reduction" | "rating_uplift" | "positive_uplift" | "repeat_reduction";
  range: { min: number; max: number };
  unit: "%" | "★";
  label: "низкий" | "средний" | "средний-высокий" | "высокий";
  reason: string;
};

type EvidenceReview = {
  reviewId: string;     // ссылка в REVIEWS
  highlight: string;    // фрагмент для подсветки
};

type ImplementationTracking = {
  implementedAt: string;
  before: { complaintsPerWeek: number; negativeShare: number };
  after:  { complaintsPerWeek: number; negativeShare: number };
  actualEffect: string; // напр. "-38%"
};
```

Новые поля в `Insight`:
- `confidenceBreakdown: ConfidenceBreakdown`
- `expectedEffectV2: ExpectedEffect` (старый строковый `expectedEffect` оставляем для совместимости с карточками списка)
- `generationReason: string[]` — 3-5 буллетов
- `evidenceReviews: EvidenceReview[]`
- `risks: string[]`
- `neededData?: string[]` — заполнено, если статус `needs_data`
- `ownerTeam`, `recommendedAction`, `taskDescription`
- `implementationTracking?: ImplementationTracking` — только для статусов `implemented`
- `subtopicId?: string`

Новый статус: `"needs_data"` добавляем в `InsightStatus`. Обновляем `StatusBadge` в `atoms.tsx`.

Иерархия подтем — отдельная константа:

```ts
export const SUBTOPICS = [
  { id: "delivery_delay", topicId: "delay", name: "Срыв сроков доставки", reviewsCount: 42 },
  { id: "courier_no_show", topicId: "delay", name: "Курьер не приехал", reviewsCount: 21 },
  { id: "delivery_damage_pkg", topicId: "delivery-damage", name: "Повреждение упаковки", reviewsCount: 17 },
  // ...по 1-3 подтемы на крупные темы
];
export function getSubtopicsByTopic(topicId: string) { ... }
```

Хелперы: `getInsightsBySubtopic`, обновлённый `getInsightsByTopic`.

---

## 2. Новые UI-компоненты (`src/components/insight/`)

Создаём небольшие переиспользуемые блоки, чтобы детальная страница не превращалась в монолит:

- `ConfidenceBreakdown.tsx` — горизонтальный stacked-bar с легендой и tooltip-ами по факторам. Сверху — большое число `86%` и пояснение «Основана на 42 отзывах, повторяемости, росте за 2 недели и 3 источниках».
- `ExpectedEffectCard.tsx` — диапазон `15–30%` визуально как «градусник», лейбл «средний-высокий», под ним курсивом `reason`.
- `GenerationReason.tsx` — список с иконкой `Sparkles` и буллетами-чек-марками.
- `EvidenceList.tsx` — карточки отзывов, где `highlight` подсвечен `<mark className="bg-ai-soft text-ai-foreground rounded px-1">…</mark>`. Источник + дата + sentiment-badge сбоку.
- `RisksList.tsx` — иконка `AlertTriangle`, мягкий жёлтый фон (token `--warning-soft`).
- `NeededDataPanel.tsx` — рендерится только при `status === "needs_data"`, мягкий синий фон, чек-лист пунктов с чекбоксами (визуальные, без логики).
- `ImpactTracker.tsx` — две колонки «До / После» + большая дельта, мини-LineChart. Рендерится только при наличии `implementationTracking`.
- `OwnerTeamCard.tsx` — команда, рекомендованное действие, кнопка «Создать задачу» (визуальная).

Все компоненты используют семантические токены из `styles.css`, без хардкода цветов. Анимации: `.anim-rise` + `.stagger` уже доступны.

---

## 3. Переработка детальной страницы (`src/routes/insights.$insightId.tsx`)

Меняем структуру вкладок, чтобы информация раскладывалась логично по «слою принятия решения»:

```
[Header: Тема → Подтема → Гипотеза + KPI Confidence/Signal/Effect]
[AI Explanation: краткое summary под заголовком]

Tabs:
 ├─ Обзор          → ConfidenceBreakdown + ExpectedEffectCard + GenerationReason
 ├─ Доказательства → EvidenceList + ссылки на полные отзывы
 ├─ Риски и данные → RisksList + NeededDataPanel
 ├─ Действие       → OwnerTeamCard + поля решения (Accept/Reject/More data)
 └─ Эффект         → ImpactTracker (или плейсхолдер «Гипотеза ещё не внедрена»)
```

KPI-карточка эффекта в шапке заменяется с «−25%» на диапазон «15–30%» с подписью «средний-высокий». Это снимает «галлюцинации точного числа».

Решение `Decision` мигрирует во вкладку «Действие» вместе с командой-владельцем.

---

## 4. Иерархия Тема → Подтема → Гипотеза

`src/routes/topics.$topicId.tsx` обновляем:
- В шапке темы: счётчики (отзывы, негатив, тренд).
- Список подтем `SUBTOPICS` карточками с мини-метриками.
- Клик по подтеме раскрывает (accordion) список гипотез внутри. Без отдельного роутинга — экономим время.

На главном списке тем (`src/routes/topics.tsx`) под мини-чартом добавляем строку «Подтемы: Срыв сроков · Курьер не приехал · …» (chip-list, до 3 шт + «+N»).

---

## 5. Карточка гипотезы в списках (`src/components/insight-card.tsx`)

Минимальные правки, чтобы новые сигналы были видны и в списке:
- Бейдж `needs_data` (новый статус).
- Если `implementationTracking` — маленький бейдж «Эффект: −38%» в шапке.
- В блоке «Ожидаемый эффект» вместо точного числа — диапазон `15–30% · средний-высокий`.

---

## Технические детали

- Новые поля в `Insight` делаем опциональными, но в `INSIGHTS` заполняем для всех 8 моков → не ломаем существующие места использования.
- Для evidence-подсветки пишем маленький утил `highlightText(text, fragment)` в `lib/utils.ts`, возвращающий массив React-нод.
- `StatusBadge` (`atoms.tsx`): добавляем стиль для `needs_data` (амбер/info токен).
- Все цвета — через токены: `--ai`, `--ai-soft`, `--warning`, `--warning-soft`, `--success`, `--info`. При отсутствии нужных токенов — добавляем в `src/styles.css` (oklch).
- Никаких новых маршрутов; только дополнения существующих.

---

## Что НЕ делаем в этой итерации

- Timeline событий и комментарии аналитиков (вторая очередь).
- CRM-matching, авто-ответы, конструктор интеграций — по решению пользователя выкидываем из MVP.
- Не трогаем глобальную навигацию и шапку — они уже переработаны.

---

## Файлы

Новые:
- `src/components/insight/ConfidenceBreakdown.tsx`
- `src/components/insight/ExpectedEffectCard.tsx`
- `src/components/insight/GenerationReason.tsx`
- `src/components/insight/EvidenceList.tsx`
- `src/components/insight/RisksList.tsx`
- `src/components/insight/NeededDataPanel.tsx`
- `src/components/insight/ImpactTracker.tsx`
- `src/components/insight/OwnerTeamCard.tsx`

Изменяемые:
- `src/lib/mock/data.ts` — типы, новые поля, `SUBTOPICS`, хелперы.
- `src/components/atoms.tsx` — `StatusBadge` для `needs_data`.
- `src/components/insight-card.tsx` — новый бейдж эффекта/needs_data, диапазон.
- `src/routes/insights.$insightId.tsx` — новая структура вкладок.
- `src/routes/topics.$topicId.tsx` — подтемы и гипотезы.
- `src/routes/topics.tsx` — chip-list подтем.
- `src/lib/utils.ts` — `highlightText`.
- `src/styles.css` — недостающие токены (warning/info), при необходимости.

Подтверди план — и я начинаю реализацию.