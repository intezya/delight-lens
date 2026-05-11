// Mock data for AI Review Intelligence
export type Sentiment = "positive" | "negative" | "mixed";
export type TopicKind = "risk" | "opportunity" | "strength";
export type InsightStatus = "new" | "validated" | "in_progress" | "implemented" | "rejected" | "needs_data";
export type InsightImpact = "down_neg" | "up_pos" | "down_repeat" | "up_sat" | "up_rating";
export type Source = "Я.Маркет" | "Otzovik" | "2GIS" | "Google Maps" | "Trustpilot" | "App Store";
export type Priority = "low" | "medium" | "high" | "critical";

export const SOURCES: Source[] = ["Я.Маркет", "Otzovik", "2GIS", "Google Maps", "Trustpilot", "App Store"];

export const TOPICS = [
  { id: "defective", name: "Бракованный или витринный товар", kind: "risk" as TopicKind },
  { id: "bad-service", name: "Плохой сервис", kind: "risk" as TopicKind },
  { id: "warranty", name: "Проблема с гарантией", kind: "risk" as TopicKind },
  { id: "order-process", name: "Проблема в процессе заказа", kind: "risk" as TopicKind },
  { id: "fraud", name: "Обман / мошенничество", kind: "risk" as TopicKind },
  { id: "support", name: "Проблема с поддержкой", kind: "risk" as TopicKind },
  { id: "payment", name: "Проблема с оплатой", kind: "risk" as TopicKind },
  { id: "delivery-damage", name: "Повреждение при доставке", kind: "risk" as TopicKind },
  { id: "positive", name: "Положительный опыт", kind: "strength" as TopicKind },
  { id: "mixed", name: "Смешанный опыт", kind: "opportunity" as TopicKind },
  { id: "price", name: "Проблема с ценой", kind: "opportunity" as TopicKind },
  { id: "fake", name: "Поддельный товар", kind: "risk" as TopicKind },
  { id: "delay", name: "Задержка доставки", kind: "risk" as TopicKind },
  { id: "legal", name: "Юридическая угроза", kind: "risk" as TopicKind },
  { id: "not-given", name: "Оплаченный товар не выдан", kind: "risk" as TopicKind },
  { id: "service-quality", name: "Проблема с обслуживанием", kind: "risk" as TopicKind },
  { id: "sarcastic", name: "Саркастически негативный отзыв", kind: "risk" as TopicKind },
  { id: "brand-strength", name: "Сильные стороны бренда", kind: "strength" as TopicKind },
  { id: "loyalty-bonus", name: "Бонусы и лояльность", kind: "strength" as TopicKind },
];

export type Topic = (typeof TOPICS)[number];

export type Review = {
  id: string;
  text: string;
  date: string;
  source: Source;
  sourceUrl: string;
  sentiment: Sentiment;
  rating: number;
  topics: string[];
  signal: number; // 0-100
  repeatCount: number;
  priority: Priority;
  linkedToKnown: boolean;
  region: string;
  category: string;
  author: string;
};

const SOURCE_URL_BASE: Record<Source, string> = {
  "Я.Маркет": "https://market.yandex.ru/shop--voicelens/123/reviews?reviewId=",
  "Otzovik": "https://otzovik.com/review_",
  "2GIS": "https://2gis.ru/firm/voicelens/tab/reviews/firmId-",
  "Google Maps": "https://www.google.com/maps/contrib/reviews/",
  "Trustpilot": "https://www.trustpilot.com/reviews/",
  "App Store": "https://apps.apple.com/ru/app/id000/reviews?reviewId=",
};

const reviewSeeds: Array<Partial<Review> & { text: string; sentiment: Sentiment; topics: string[] }> = [
  { text: "Как из нас сделали лохов за 150 тысяч рублей... Привезли витринный товар, на корпусе царапины, упаковка вскрыта. Менеджер уверял, что новый.", sentiment: "negative", topics: ["defective", "fraud"], rating: 1, signal: 92, repeatCount: 14, priority: "critical" },
  { text: "Не рекомендую к сотрудничеству. Сроки сорваны, поддержка отвечает шаблонами.", sentiment: "negative", topics: ["bad-service", "support"], rating: 2, signal: 71, repeatCount: 8, priority: "high" },
  { text: "Кинули с гарантией, испортили товар при ремонте и отказали в замене. Будем разбираться через Роспотребнадзор.", sentiment: "negative", topics: ["warranty", "legal"], rating: 1, signal: 88, repeatCount: 11, priority: "critical" },
  { text: "Молитесь чтобы товар был целый — упаковка была вскрыта, на коробке вмятины. Внутри всё ок, но осадок остался.", sentiment: "mixed", topics: ["delivery-damage", "defective"], rating: 3, signal: 64, repeatCount: 6, priority: "medium" },
  { text: "Из последних покупок — фен Dyson, довольна, греет быстро, упакован отлично, привезли вовремя.", sentiment: "positive", topics: ["positive", "brand-strength"], rating: 5, signal: 58, repeatCount: 0, priority: "low" },
  { text: "С пустыми руками уйти сложно — ассортимент огромный, консультанты подсказывают по делу.", sentiment: "positive", topics: ["positive"], rating: 5, signal: 49, repeatCount: 0, priority: "low" },
  { text: "Опыт покупок с 2014 г. Реальные бонусы за покупку, копятся, можно тратить. Программа лояльности — лучшая на рынке.", sentiment: "positive", topics: ["loyalty-bonus", "brand-strength"], rating: 5, signal: 76, repeatCount: 0, priority: "low" },
  { text: "Торгует паленой техникой! Купил наушники — серийник не пробивается на сайте производителя.", sentiment: "negative", topics: ["fake", "fraud"], rating: 1, signal: 84, repeatCount: 9, priority: "critical" },
  { text: "Заказал и оплатил через сайт; доставку переносили четыре раза. В итоге — отказ без объяснений.", sentiment: "negative", topics: ["delay", "order-process"], rating: 1, signal: 79, repeatCount: 17, priority: "high" },
  { text: "Отвратительный магазин! Продают бракованный товар! Стиральная машина потекла на третий день.", sentiment: "negative", topics: ["defective", "warranty"], rating: 1, signal: 81, repeatCount: 12, priority: "high" },
  { text: "Цена в чеке оказалась выше, чем на ценнике. Пришлось доказывать на месте.", sentiment: "negative", topics: ["price", "service-quality"], rating: 2, signal: 55, repeatCount: 5, priority: "medium" },
  { text: "Оплата картой не прошла трижды, деньги списались, заказ не оформился. Ждать возврат — две недели.", sentiment: "negative", topics: ["payment", "support"], rating: 1, signal: 73, repeatCount: 9, priority: "high" },
  { text: "Привезли вовремя, курьер вежливый, всё распаковали при мне. Браво, так держать.", sentiment: "positive", topics: ["positive"], rating: 5, signal: 42, repeatCount: 0, priority: "low" },
  { text: "Сервис на пятёрку — ответили за 2 минуты в чате, решили вопрос с возвратом без волокиты.", sentiment: "positive", topics: ["positive", "support"], rating: 5, signal: 61, repeatCount: 0, priority: "low" },
  { text: "Оплатил, обещали выдать в магазине, приехал — товара нет, заказ потерян. Деньги вернули, но осадок.", sentiment: "negative", topics: ["not-given", "order-process"], rating: 1, signal: 68, repeatCount: 7, priority: "high" },
  { text: "Спасибо! Очень оперативно. Огромный выбор. Бонусная программа работает, ничего не пропадает.", sentiment: "positive", topics: ["positive", "loyalty-bonus"], rating: 5, signal: 53, repeatCount: 0, priority: "low" },
  { text: "Замечательный магазин — обязательно зайдите за чувством, что вас обманут. Сарказм не передать.", sentiment: "negative", topics: ["sarcastic", "fraud"], rating: 1, signal: 47, repeatCount: 3, priority: "medium" },
  { text: "Пылесос работает отлично, доставили на следующий день, цена ниже, чем у конкурентов.", sentiment: "positive", topics: ["positive", "price"], rating: 5, signal: 56, repeatCount: 0, priority: "low" },
  { text: "Очередь в самовывозе — час. Сотрудники не справляются. Зато товар хороший.", sentiment: "mixed", topics: ["service-quality", "positive"], rating: 3, signal: 44, repeatCount: 4, priority: "medium" },
  { text: "Гарантийный случай рассматривают месяц. Звонишь — обещают перезвонить. Не перезванивают.", sentiment: "negative", topics: ["warranty", "support"], rating: 1, signal: 77, repeatCount: 13, priority: "high" },
];

const REGIONS = ["Москва", "СПб", "Екатеринбург", "Казань", "Новосибирск", "Краснодар"];
const CATEGORIES = ["Электроника", "Бытовая техника", "Аудио", "Уход", "Компьютеры"];
const AUTHORS = ["Алексей К.", "Мария В.", "Дмитрий П.", "Ольга С.", "Иван Н.", "Екатерина Р.", "Сергей М.", "Анна Б."];

function dayOffsetISO(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const REVIEWS: Review[] = Array.from({ length: 64 }).map((_, i) => {
  const seed = reviewSeeds[i % reviewSeeds.length];
  const daysAgo = Math.floor((i * 1.4) % 89);
  const source = SOURCES[i % SOURCES.length];
  const id = `r-${i + 1}`;
  return {
    id,
    text: seed.text,
    date: dayOffsetISO(daysAgo),
    source,
    sourceUrl: `${SOURCE_URL_BASE[source]}${id}`,
    sentiment: seed.sentiment,
    rating: seed.rating ?? 3,
    topics: seed.topics,
    signal: seed.signal ?? 50,
    repeatCount: seed.repeatCount ?? 0,
    priority: seed.priority ?? "medium",
    linkedToKnown: (seed.repeatCount ?? 0) > 4,
    region: REGIONS[i % REGIONS.length],
    category: CATEGORIES[i % CATEGORIES.length],
    author: AUTHORS[i % AUTHORS.length],
  };
});

// 90-day time series
export const TIMESERIES = Array.from({ length: 90 }).map((_, i) => {
  const day = 89 - i;
  const d = new Date();
  d.setDate(d.getDate() - day);
  const base = 40 + Math.sin(i / 8) * 12 + i * 0.4;
  const pos = Math.round(base * 0.42 + Math.random() * 6);
  const neg = Math.round(base * 0.38 + Math.random() * 8 - (i > 60 ? 6 : 0));
  const mix = Math.round(base * 0.2 + Math.random() * 4);
  const sentiment = Math.round(((pos - neg) / Math.max(1, pos + neg + mix)) * 100);
  return {
    date: d.toISOString().slice(0, 10),
    label: d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" }),
    positive: pos,
    negative: neg,
    mixed: mix,
    total: pos + neg + mix,
    sentiment,
  };
});

export const SOURCE_RATINGS = TIMESERIES.filter((_, i) => i % 6 === 0).map((d) => ({
  date: d.label,
  "Я.Маркет": +(4.0 + Math.sin(d.total / 10) * 0.3 + 0.15).toFixed(2),
  "Otzovik": +(3.4 + Math.cos(d.total / 12) * 0.25).toFixed(2),
  "2GIS": +(4.2 + Math.sin(d.total / 9) * 0.2).toFixed(2),
  "Google Maps": +(4.5 + Math.cos(d.total / 14) * 0.15).toFixed(2),
}));

export type ConfidenceBreakdown = {
  reviewsCount: number;
  factors: {
    label: string;
    score: number; // contribution points
    description: string;
  }[];
};

export type ExpectedEffect = {
  type: "complaints_reduction" | "rating_uplift" | "positive_uplift" | "repeat_reduction";
  range: { min: number; max: number };
  unit: "%" | "★";
  label: "низкий" | "средний" | "средний-высокий" | "высокий";
  reason: string;
};

export type EvidenceReview = {
  reviewId: string;
  highlight: string;
};

export type ImplementationTracking = {
  implementedAt: string;
  before: { complaintsPerWeek: number; negativeShare: number };
  after: { complaintsPerWeek: number; negativeShare: number };
  actualEffect: string;
};

export type HypothesisStatement = {
  ifPart: string;
  thenPart: string;
  becausePart: string;
};

export type ValidationPlan = {
  format: string;
  duration: string;
  metric: string;
  teams: string[];
};

/**
 * Подтверждённость самой проблемы (отдельно от уверенности в причине).
 * Высокая = отзывы устойчиво указывают, что проблема существует.
 */
export type ProblemConfidence = {
  level: "low" | "medium" | "high";
  reviewsCount: number;
  description: string;
};

/**
 * Одна из альтернативных возможных причин одной и той же проблемы.
 * AI предлагает несколько версий — пользователь выбирает, какую расследовать.
 */
export type CauseHypothesis = {
  id: string;
  /** Одна фраза в стиле «Возможная причина: …» */
  statement: string;
  /** Уверенность системы именно в этой причине (отдельно от подтверждённости проблемы) */
  solutionConfidence: number;
  confidenceLabel: "низкая" | "средняя" | "высокая";
  /** Чек-лист «что проверить перед внедрением» */
  whatToCheck: string[];
  /** Чего не хватает в данных */
  missingData: string[];
  /** Исследовательские шаги (а не «внедрить») */
  nextActions: string[];
  /** Поддерживающие отзывы (id) */
  supportingReviewIds: string[];
};

export type Insight = {
  id: string;
  title: string;
  description: string;
  topicId: string;
  subtopicId?: string;
  status: InsightStatus;
  impact: InsightImpact;
  confidence: number;
  signal: number;
  expectedEffect: string;
  priority: Priority;
  owner: { name: string; team: string };
  createdAt: string;
  reviewIds: string[];
  // New explainability fields
  confidenceBreakdown: ConfidenceBreakdown;
  expectedEffectV2: ExpectedEffect;
  generationReason: string[];
  evidenceReviews: EvidenceReview[];
  risks: string[];
  neededData?: string[];
  ownerTeam: string;
  recommendedAction: string;
  taskDescription: string;
  implementationTracking?: ImplementationTracking;
  // New (optional, fallback by helper)
  hypothesisStatement?: HypothesisStatement;
  nextSteps?: string[];
  validationPlan?: ValidationPlan;
  /** Подтверждённость проблемы (отдельно от уверенности в решении) */
  problemConfidence?: ProblemConfidence;
  /** Альтернативные возможные причины (≥2 — это brainstorming, а не готовое решение) */
  alternatives?: CauseHypothesis[];
};

// Map english team names to friendly Russian labels
const TEAM_RU: Record<string, string> = {
  "Retail Ops": "Команда складского контроля",
  "Logistics": "Команда доставки",
  "Marketing": "Команда маркетинга",
  "Customer Care": "Команда клиентского сервиса",
  "Payments": "Команда платежей",
  "Last Mile": "Команда последней мили",
  "Quality": "Команда контроля качества",
};
export function localizeTeam(team: string): string {
  return TEAM_RU[team] ?? team;
}

export type Subtopic = {
  id: string;
  topicId: string;
  name: string;
  reviewsCount: number;
  trend: string; // e.g. "+18%"
};

export const SUBTOPICS: Subtopic[] = [
  { id: "delivery_delay", topicId: "delay", name: "Срыв сроков доставки", reviewsCount: 42, trend: "+23%" },
  { id: "courier_no_show", topicId: "delay", name: "Курьер не приехал", reviewsCount: 21, trend: "+8%" },
  { id: "delivery_reschedule", topicId: "delay", name: "Перенос без предупреждения", reviewsCount: 14, trend: "+12%" },
  { id: "package_damage", topicId: "delivery-damage", name: "Повреждение упаковки", reviewsCount: 17, trend: "+4%" },
  { id: "showroom_as_new", topicId: "defective", name: "Витринный товар как новый", reviewsCount: 14, trend: "+18%" },
  { id: "broken_on_arrival", topicId: "defective", name: "Брак при получении", reviewsCount: 11, trend: "+6%" },
  { id: "warranty_sla", topicId: "warranty", name: "Просрочка SLA по гарантии", reviewsCount: 13, trend: "+9%" },
  { id: "warranty_refusal", topicId: "warranty", name: "Отказ в гарантии", reviewsCount: 7, trend: "−3%" },
  { id: "double_charge", topicId: "payment", name: "Двойное списание", reviewsCount: 9, trend: "+11%" },
  { id: "loyalty_bonuses", topicId: "loyalty-bonus", name: "Реальные бонусы", reviewsCount: 32, trend: "+14%" },
  { id: "fake_serial", topicId: "fake", name: "Серийник не пробивается", reviewsCount: 9, trend: "+22%" },
  { id: "queue_pickup", topicId: "service-quality", name: "Очереди в самовывозе", reviewsCount: 4, trend: "+1%" },
  { id: "courier_unboxing", topicId: "positive", name: "Распаковка при клиенте", reviewsCount: 18, trend: "+7%" },
];

export function getSubtopicsByTopic(topicId: string) {
  return SUBTOPICS.filter((s) => s.topicId === topicId);
}
export function getSubtopic(id: string) {
  return SUBTOPICS.find((s) => s.id === id);
}

// Helpers used by insight mocks
function cb(reviewsCount: number, factors: ConfidenceBreakdown["factors"]): ConfidenceBreakdown {
  return { reviewsCount, factors };
}

export const INSIGHTS: Insight[] = [
  {
    id: "i-1",
    title: "Витринный товар продаётся как новый",
    description: "AI выявил 14 повторяющихся жалоб на B2C-продажу витринных образцов под видом нового товара. Концентрация на категории «Электроника» в Москве и СПб.",
    topicId: "defective",
    subtopicId: "showroom_as_new",
    status: "validated",
    impact: "down_neg",
    confidence: 92,
    signal: 88,
    expectedEffect: "−15…25% негатива в категории",
    priority: "critical",
    owner: { name: "Мария В.", team: "Retail Ops" },
    createdAt: dayOffsetISO(6),
    reviewIds: ["r-1", "r-10"],
    confidenceBreakdown: cb(38, [
      { label: "Объём отзывов", score: 28, description: "38 отзывов за 30 дней — устойчивый сигнал" },
      { label: "Повторяемость", score: 22, description: "В 76% жалоб одинаковая формулировка про «витринный»" },
      { label: "Тональность", score: 18, description: "94% жалоб — резко негативные" },
      { label: "Разные источники", score: 14, description: "Жалобы в Я.Маркет, 2GIS и Otzovik" },
      { label: "Свежесть", score: 10, description: "Рост обращений в последние 2 недели" },
    ]),
    expectedEffectV2: {
      type: "complaints_reduction",
      range: { min: 15, max: 25 },
      unit: "%",
      label: "средний-высокий",
      reason: "Тема встречается в 22% отзывов категории «Электроника» и растёт 3 недели подряд",
    },
    generationReason: [
      "Найдено 38 похожих отзывов за 30 дней",
      "В 76% сообщений упоминается «витринный» / «вскрытая упаковка»",
      "Концентрация в Москве и СПб — 71% жалоб",
      "Жалобы повторяются в 3 источниках: Я.Маркет, 2GIS, Otzovik",
    ],
    evidenceReviews: [
      { reviewId: "r-1", highlight: "Привезли витринный товар, на корпусе царапины, упаковка вскрыта" },
      { reviewId: "r-10", highlight: "Продают бракованный товар" },
      { reviewId: "r-4", highlight: "упаковка была вскрыта, на коробке вмятины" },
    ],
    risks: [
      "Часть жалоб может относиться к повреждениям при транспортировке, а не к витринным образцам",
      "Концентрация в Москве и СПб может быть смещением выборки",
      "Нет данных от службы приёмки о статусе товара",
    ],
    ownerTeam: "Retail Ops",
    recommendedAction: "Передать команде складского контроля",
    taskDescription: "Ввести фотофиксацию состояния товара перед отгрузкой и обязательную маркировку витринных образцов",
  },
  {
    id: "i-2",
    title: "Срыв сроков доставки кратно растёт по выходным",
    description: "Кластер из 17 отзывов о переносе доставки 3+ раз. Корреляция с пятницей и предпраздничными днями — слот переполнения склада.",
    topicId: "delay",
    subtopicId: "delivery_delay",
    status: "in_progress",
    impact: "down_repeat",
    confidence: 86,
    signal: 79,
    expectedEffect: "−15…30% повторных жалоб",
    priority: "high",
    owner: { name: "Дмитрий П.", team: "Logistics" },
    createdAt: dayOffsetISO(11),
    reviewIds: ["r-9"],
    confidenceBreakdown: cb(42, [
      { label: "Объём отзывов", score: 25, description: "42 отзыва по теме доставки за 30 дней" },
      { label: "Повторяемость", score: 20, description: "У 67% — перенос 3+ раз" },
      { label: "Тональность", score: 18, description: "88% жалоб негативные" },
      { label: "Разные источники", score: 12, description: "Я.Маркет, 2GIS и App Store" },
      { label: "Свежесть", score: 11, description: "Рост на 23% за последние 2 недели" },
    ]),
    expectedEffectV2: {
      type: "repeat_reduction",
      range: { min: 15, max: 30 },
      unit: "%",
      label: "средний-высокий",
      reason: "Проблема встречается в 18% отзывов о доставке и растёт последние 3 недели",
    },
    generationReason: [
      "За последние 30 дней найдено 42 отзыва по теме доставки",
      "Доля жалоб на перенос сроков выросла на 23%",
      "Большинство жалоб связано с выходными и праздничными днями",
      "Жалобы повторяются в 3 источниках: Я.Маркет, 2GIS, App Store",
    ],
    evidenceReviews: [
      { reviewId: "r-9", highlight: "доставку переносили четыре раза" },
      { reviewId: "r-2", highlight: "Сроки сорваны, поддержка отвечает шаблонами" },
    ],
    risks: [
      "Часть жалоб может относиться не к доставке, а к работе склада",
      "Пик может быть связан с праздниками, а не с системной проблемой",
      "Недостаточно данных по фактическим отменам заказов",
    ],
    ownerTeam: "Logistics",
    recommendedAction: "Передать команде доставки",
    taskDescription: "Проверить причины переносов заказов в выходные и предпраздничные дни, расширить слоты выходного дня",
  },
  {
    id: "i-3",
    title: "Программа лояльности — главный driver позитива",
    description: "В 76 положительных отзывах упоминаются «реальные бонусы» и «накопления с 2014». Можно усилить коммуникацию и конвертировать в NPS.",
    topicId: "loyalty-bonus",
    subtopicId: "loyalty_bonuses",
    status: "new",
    impact: "up_pos",
    confidence: 81,
    signal: 76,
    expectedEffect: "+8…15% позитивных упоминаний",
    priority: "medium",
    owner: { name: "Ольга С.", team: "Marketing" },
    createdAt: dayOffsetISO(3),
    reviewIds: ["r-7", "r-16"],
    confidenceBreakdown: cb(76, [
      { label: "Объём отзывов", score: 30, description: "76 положительных упоминаний за период" },
      { label: "Повторяемость", score: 18, description: "Устойчивая лексика «реальные бонусы»" },
      { label: "Тональность", score: 17, description: "100% упоминаний позитивные" },
      { label: "Разные источники", score: 9, description: "Я.Маркет и Trustpilot" },
      { label: "Свежесть", score: 7, description: "Стабильный позитивный тренд" },
    ]),
    expectedEffectV2: {
      type: "positive_uplift",
      range: { min: 8, max: 15 },
      unit: "%",
      label: "средний",
      reason: "Аудитория уже благодарит — коммуникация усилит уже существующий сигнал",
    },
    generationReason: [
      "Найдено 76 положительных упоминаний программы лояльности",
      "В 41% отзывов — формулировка «реальные бонусы»",
      "Доля упоминаний выросла на 14% за месяц",
      "Сигнал устойчиво положительный во всех каналах",
    ],
    evidenceReviews: [
      { reviewId: "r-7", highlight: "Реальные бонусы за покупку, копятся, можно тратить" },
      { reviewId: "r-16", highlight: "Бонусная программа работает, ничего не пропадает" },
    ],
    risks: [
      "Усиленная коммуникация может вызвать рост ожиданий и негатив, если изменятся условия",
      "Не все каналы маркетинга подходят для такой темы",
    ],
    ownerTeam: "Marketing",
    recommendedAction: "Передать в маркетинг для усиления коммуникации",
    taskDescription: "Включить тезисы о бонусах в email-рассылки и оформление заказа, запустить A/B-тест",
  },
  {
    id: "i-4",
    title: "Гарантийный отдел: SLA нарушен в 38% обращений",
    description: "AI сгруппировал 13 жалоб с одинаковым сценарием: «звонишь — обещают перезвонить — не перезванивают». Среднее время до ответа — 9 дней.",
    topicId: "warranty",
    subtopicId: "warranty_sla",
    status: "in_progress",
    impact: "down_neg",
    confidence: 89,
    signal: 84,
    expectedEffect: "−15…22% негатива по гарантии",
    priority: "critical",
    owner: { name: "Иван Н.", team: "Customer Care" },
    createdAt: dayOffsetISO(14),
    reviewIds: ["r-3", "r-20"],
    confidenceBreakdown: cb(34, [
      { label: "Объём отзывов", score: 26, description: "34 жалобы по теме гарантии" },
      { label: "Повторяемость", score: 24, description: "В 72% — одинаковый сценарий" },
      { label: "Тональность", score: 20, description: "91% — резко негативные" },
      { label: "Разные источники", score: 11, description: "Otzovik, 2GIS, Я.Маркет" },
      { label: "Свежесть", score: 8, description: "Стабильный поток жалоб" },
    ]),
    expectedEffectV2: {
      type: "complaints_reduction",
      range: { min: 15, max: 22 },
      unit: "%",
      label: "средний-высокий",
      reason: "Сценарий одинаковый и повторяется — точечное исправление SLA даст эффект",
    },
    generationReason: [
      "Найдено 34 похожих отзыва за 30 дней",
      "В 72% повторяется сценарий «обещают перезвонить — не перезванивают»",
      "Среднее время до ответа в кластере — 9 дней",
      "Жалобы стабильно поступают в 3 источниках",
    ],
    evidenceReviews: [
      { reviewId: "r-3", highlight: "Кинули с гарантией, испортили товар при ремонте и отказали в замене" },
      { reviewId: "r-20", highlight: "Звонишь — обещают перезвонить. Не перезванивают" },
    ],
    risks: [
      "Часть случаев может быть связана с поведением клиентов, а не с SLA",
      "Нет данных из CRM по реальной длительности обработки",
    ],
    ownerTeam: "Customer Care",
    recommendedAction: "Передать в Customer Care",
    taskDescription: "Ввести SLA 48 часов на первый ответ по гарантии и автоэскалейт при просрочке",
  },
  {
    id: "i-5",
    title: "Двойное списание при ошибке оплаты",
    description: "9 одинаковых сценариев: оплата не проходит, деньги списываются, заказ не оформляется. Ждут возврат 14 дней.",
    topicId: "payment",
    subtopicId: "double_charge",
    status: "needs_data",
    impact: "down_neg",
    confidence: 71,
    signal: 73,
    expectedEffect: "−10…20% жалоб на оплату",
    priority: "high",
    owner: { name: "Сергей М.", team: "Payments" },
    createdAt: dayOffsetISO(8),
    reviewIds: ["r-12"],
    confidenceBreakdown: cb(9, [
      { label: "Объём отзывов", score: 14, description: "9 жалоб — кластер небольшой, но плотный" },
      { label: "Повторяемость", score: 22, description: "Идентичный сценарий во всех 9 случаях" },
      { label: "Тональность", score: 18, description: "100% — резко негативные" },
      { label: "Разные источники", score: 9, description: "Я.Маркет и App Store" },
      { label: "Свежесть", score: 8, description: "Все жалобы за последние 14 дней" },
    ]),
    expectedEffectV2: {
      type: "complaints_reduction",
      range: { min: 10, max: 20 },
      unit: "%",
      label: "средний",
      reason: "Объём кластера небольшой — для уверенной оценки нужны данные платёжного шлюза",
    },
    generationReason: [
      "9 жалоб с одинаковым сценарием за 14 дней",
      "Все упоминают двойное списание и долгий возврат",
      "Концентрация в App Store — возможна проблема в мобильной оплате",
    ],
    evidenceReviews: [
      { reviewId: "r-12", highlight: "деньги списались, заказ не оформился" },
    ],
    risks: [
      "Кластер маленький — возможно, разовые сбои шлюза",
      "Без логов платёжного шлюза нельзя подтвердить причину",
    ],
    neededData: [
      "Логи платёжного шлюза за последние 30 дней",
      "Данные по успешным/неуспешным транзакциям с разбивкой по способам оплаты",
      "Среднее время возврата средств",
    ],
    ownerTeam: "Payments",
    recommendedAction: "Запросить данные у Payments перед передачей в работу",
    taskDescription: "Проанализировать логи платёжного шлюза за 30 дней и сопоставить с жалобами",
  },
  {
    id: "i-6",
    title: "Курьеры с распаковкой — рост позитива",
    description: "Упоминание «распаковали при мне» сильно коррелирует с 5★. Можно стандартизировать как чек-лист курьера.",
    topicId: "positive",
    subtopicId: "courier_unboxing",
    status: "implemented",
    impact: "up_rating",
    confidence: 78,
    signal: 61,
    expectedEffect: "+0.2…0.4★ средняя оценка",
    priority: "medium",
    owner: { name: "Екатерина Р.", team: "Last Mile" },
    createdAt: dayOffsetISO(28),
    reviewIds: ["r-13"],
    confidenceBreakdown: cb(28, [
      { label: "Объём отзывов", score: 22, description: "28 положительных упоминаний практики" },
      { label: "Повторяемость", score: 18, description: "Устойчивая фраза «распаковали при мне»" },
      { label: "Тональность", score: 18, description: "100% позитивные упоминания" },
      { label: "Разные источники", score: 10, description: "Я.Маркет, 2GIS, Google Maps" },
      { label: "Свежесть", score: 10, description: "Свежий тренд после пилота курьеров" },
    ]),
    expectedEffectV2: {
      type: "rating_uplift",
      range: { min: 0.2, max: 0.4 },
      unit: "★",
      label: "средний",
      reason: "Распаковка при клиенте устойчиво коррелирует с 5★ в кластере",
    },
    generationReason: [
      "В 28 отзывах с 5★ встречается фраза «распаковали при мне»",
      "Корреляция с оценкой 5★ — 0.74",
      "Тренд устойчиво растёт после пилота",
    ],
    evidenceReviews: [
      { reviewId: "r-13", highlight: "курьер вежливый, всё распаковали при мне" },
    ],
    risks: [
      "Не все категории товаров позволяют распаковку при клиенте",
      "Может увеличить время на одну доставку",
    ],
    ownerTeam: "Last Mile",
    recommendedAction: "Стандартизировать как чек-лист курьера",
    taskDescription: "Обновить инструкцию last-mile, обучить 50 курьеров пилота",
    implementationTracking: {
      implementedAt: dayOffsetISO(28),
      before: { complaintsPerWeek: 34, negativeShare: 72 },
      after: { complaintsPerWeek: 21, negativeShare: 51 },
      actualEffect: "+0.4★",
    },
  },
  {
    id: "i-7",
    title: "Подозрение на серый канал поставок",
    description: "Кластер «серийник не пробивается» — 9 отзывов за 30 дней. Концентрация в категории «Аудио».",
    topicId: "fake",
    subtopicId: "fake_serial",
    status: "needs_data",
    impact: "down_neg",
    confidence: 71,
    signal: 84,
    expectedEffect: "−10…15% жалоб на подделки",
    priority: "critical",
    owner: { name: "Алексей К.", team: "Quality" },
    createdAt: dayOffsetISO(2),
    reviewIds: ["r-8"],
    confidenceBreakdown: cb(9, [
      { label: "Объём отзывов", score: 14, description: "Кластер небольшой, но критичный" },
      { label: "Повторяемость", score: 22, description: "Одинаковая формулировка про серийный номер" },
      { label: "Тональность", score: 19, description: "100% резко негативные" },
      { label: "Разные источники", score: 9, description: "Я.Маркет и Otzovik" },
      { label: "Свежесть", score: 7, description: "Все жалобы за 30 дней" },
    ]),
    expectedEffectV2: {
      type: "complaints_reduction",
      range: { min: 10, max: 15 },
      unit: "%",
      label: "средний",
      reason: "Сценарий устойчивый, но без данных от поставщиков точная оценка невозможна",
    },
    generationReason: [
      "9 отзывов с упоминанием непробиваемого серийного номера",
      "Концентрация в категории Аудио",
      "Один поставщик упоминается чаще остальных",
    ],
    evidenceReviews: [
      { reviewId: "r-8", highlight: "серийник не пробивается на сайте производителя" },
    ],
    risks: [
      "Часть случаев может быть связана с задержкой регистрации серийников",
      "Нет данных от производителей о статусе серийников",
    ],
    neededData: [
      "Список поставщиков с долей возвратов по «серийнику»",
      "API проверки серийных номеров от 2 ключевых производителей",
      "Разбивка возвратов по партиям",
    ],
    ownerTeam: "Quality",
    recommendedAction: "Запросить данные у поставщиков и QA",
    taskDescription: "Согласовать пилот по проверке серийников через API на категории Аудио",
  },
  {
    id: "i-8",
    title: "Очереди на самовывозе в час пик",
    description: "Смешанные отзывы с темой «час очереди» — 4 повтора. Решение: дополнительный сотрудник 18:00–20:00.",
    topicId: "service-quality",
    subtopicId: "queue_pickup",
    status: "rejected",
    impact: "up_sat",
    confidence: 64,
    signal: 44,
    expectedEffect: "+3…7% удовлетворённости",
    priority: "low",
    owner: { name: "Анна Б.", team: "Retail Ops" },
    createdAt: dayOffsetISO(20),
    reviewIds: ["r-19"],
    confidenceBreakdown: cb(4, [
      { label: "Объём отзывов", score: 8, description: "Всего 4 отзыва — слабый сигнал" },
      { label: "Повторяемость", score: 20, description: "Одинаковая формулировка" },
      { label: "Тональность", score: 14, description: "Смешанная" },
      { label: "Разные источники", score: 12, description: "2GIS и Google Maps" },
      { label: "Свежесть", score: 10, description: "Все за последние 3 недели" },
    ]),
    expectedEffectV2: {
      type: "positive_uplift",
      range: { min: 3, max: 7 },
      unit: "%",
      label: "низкий",
      reason: "Малый кластер — эффект ограничен",
    },
    generationReason: [
      "4 отзыва о часовых очередях в самовывозе",
      "Концентрация в одной точке",
      "Время — вечерний пик 18:00–20:00",
    ],
    evidenceReviews: [
      { reviewId: "r-19", highlight: "Очередь в самовывозе — час" },
    ],
    risks: [
      "Маленький кластер — статистически слабый",
      "Возможно, проблема разовая",
    ],
    ownerTeam: "Retail Ops",
    recommendedAction: "Не передавать в работу — недостаточно сигнала",
    taskDescription: "Возврат к теме при росте кластера до 10+ отзывов",
  },
];

export type Anomaly = {
  id: string;
  topicId: string;
  spike: number;
  description: string;
  date: string;
};

export const ANOMALIES: Anomaly[] = [
  { id: "a1", topicId: "delay", spike: 142, description: "Резкий рост жалоб на сроки доставки за 7 дней", date: dayOffsetISO(2) },
  { id: "a2", topicId: "payment", spike: 88, description: "Всплеск проблем с оплатой картой Мир", date: dayOffsetISO(5) },
  { id: "a3", topicId: "positive", spike: 34, description: "Положительные упоминания программы лояльности +34%", date: dayOffsetISO(1) },
  { id: "a4", topicId: "fake", spike: 67, description: "Новый кластер: серые поставки в категории Аудио", date: dayOffsetISO(4) },
];

// Topic distribution
export const TOPIC_DISTRIBUTION = TOPICS.map((t) => {
  const reviews = REVIEWS.filter((r) => r.topics.includes(t.id));
  const pos = reviews.filter((r) => r.sentiment === "positive").length;
  const neg = reviews.filter((r) => r.sentiment === "negative").length;
  const mix = reviews.filter((r) => r.sentiment === "mixed").length;
  return { ...t, total: reviews.length, positive: pos, negative: neg, mixed: mix };
}).filter((t) => t.total > 0).sort((a, b) => b.total - a.total);

export function getTopic(id: string) {
  return TOPICS.find((t) => t.id === id);
}

export function getReview(id: string) {
  return REVIEWS.find((r) => r.id === id);
}

// Hypothesis statements + next steps + validation plans (kept separately to avoid touching every insight inline)
const INSIGHT_EXTRAS: Record<string, { hypothesisStatement: HypothesisStatement; nextSteps: string[]; validationPlan: ValidationPlan }> = {
// Подтверждённость проблем + альтернативные гипотезы (P0 — фидбек Yasya)
const PROBLEM_CONFIDENCE: Record<string, ProblemConfidence> = {
  "i-1": { level: "high", reviewsCount: 38, description: "76% жалоб содержат одинаковую формулировку «витринный» в 3 разных источниках" },
  "i-2": { level: "high", reviewsCount: 42, description: "67% жалоб — повторный перенос 3+ раз, рост на 23% за 2 недели" },
  "i-3": { level: "high", reviewsCount: 76, description: "Устойчивая позитивная лексика «реальные бонусы» в нескольких каналах" },
  "i-4": { level: "high", reviewsCount: 34, description: "В 72% жалоб одинаковый сценарий «обещают перезвонить — не перезванивают»" },
  "i-5": { level: "medium", reviewsCount: 9, description: "Кластер маленький, но сценарий идентичный — нужны логи шлюза" },
  "i-6": { level: "high", reviewsCount: 28, description: "Корреляция фразы «распаковали при мне» с оценкой 5★ — 0.74" },
  "i-7": { level: "medium", reviewsCount: 9, description: "Сигнал критичный, но требует подтверждения данными от поставщиков" },
  "i-8": { level: "low", reviewsCount: 4, description: "Кластер слишком маленький — статистически слабый сигнал" },
};

const INSIGHT_ALTERNATIVES: Record<string, CauseHypothesis[]> = {
  "i-1": [
    {
      id: "i-1-a",
      statement: "Возможно, на складе нет явной маркировки витринных образцов — товар попадает в отгрузку как новый",
      solutionConfidence: 64,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Найти заказы клиентов из 14 жалоб и посмотреть SKU",
        "Проверить, как товар был помечен в WMS на момент отгрузки",
        "Сверить путь товара: склад → магазин → продажа",
        "Проверить, были ли похожие случаи по этим SKU",
      ],
      missingData: [
        "Номера заказов из жалоб",
        "Статус товара в WMS (новый / витринный)",
        "История перемещений конкретных SKU",
      ],
      nextActions: [
        "Сформировать список SKU из жалоб для аудита",
        "Запросить выгрузку WMS по этим SKU",
        "Связаться с 3–5 клиентами для уточнения",
      ],
      supportingReviewIds: ["r-1", "r-10"],
    },
    {
      id: "i-1-b",
      statement: "Возможно, продавцы не предупреждают клиента, что товар был с витрины",
      solutionConfidence: 51,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Запросить запись разговоров / чатов из CRM по 3–5 кейсам",
        "Проверить чек-лист продавца на наличие пункта «уведомить»",
        "Сравнить долю жалоб по магазинам с разной обученностью",
      ],
      missingData: [
        "Скрипты продаж / чек-листы консультантов",
        "Записи общения с клиентом по конкретным заказам",
      ],
      nextActions: [
        "Запросить у Retail Ops актуальные скрипты",
        "Провести выборочный mystery-shopping",
      ],
      supportingReviewIds: ["r-1"],
    },
    {
      id: "i-1-c",
      statement: "Возможно, в учётной системе нет явного статуса «витринный» — поэтому информация теряется на пути склад → магазин",
      solutionConfidence: 47,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Проверить структуру справочника товаров — есть ли поле «состояние»",
        "Посмотреть, как этот атрибут передаётся в чек / накладную",
        "Сверить с командой IT, какие справочники синхронизируются",
      ],
      missingData: [
        "Схема товарного справочника",
        "Логи интеграции WMS ↔ POS",
      ],
      nextActions: [
        "Запросить у IT схему товарного справочника",
        "Согласовать пилот: добавить флаг «витринный» в карточку",
      ],
      supportingReviewIds: ["r-10"],
    },
    {
      id: "i-1-d",
      statement: "Возможно, часть жалоб — на повреждённую упаковку при доставке, и клиент трактует это как «витринный»",
      solutionConfidence: 38,
      confidenceLabel: "низкая",
      whatToCheck: [
        "Разделить жалобы по формулировкам: «витрина» vs «упаковка»",
        "Сверить с логами доставки — были ли инциденты по этим заказам",
      ],
      missingData: [
        "Фотофиксация при выдаче курьером",
        "Лог инцидентов last-mile",
      ],
      nextActions: [
        "Уточнить у клиентов, как именно выглядел товар при получении",
      ],
      supportingReviewIds: ["r-4"],
    },
  ],
  "i-2": [
    {
      id: "i-2-a",
      statement: "Возможно, слоты выходного дня переполняются, и заказы автоматически переносятся системой",
      solutionConfidence: 68,
      confidenceLabel: "высокая",
      whatToCheck: [
        "Сверить % загрузки слотов в пятницу–субботу с будними днями",
        "Проверить, какие правила автопереноса заданы в системе",
        "Сопоставить даты переносов из жалоб с фактической загрузкой",
      ],
      missingData: [
        "Данные загрузки слотов по дням недели",
        "Логика автопереноса в системе доставки",
      ],
      nextActions: [
        "Запросить у логистики выгрузку по слотам за 30 дней",
        "Сформулировать гипотезу для пилота расширенных слотов",
      ],
      supportingReviewIds: ["r-9"],
    },
    {
      id: "i-2-b",
      statement: "Возможно, у подрядчика доставки не хватает курьеров на выходные — и переносы идут со стороны курьерской службы",
      solutionConfidence: 55,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Запросить у подрядчика отчёт по доступности курьеров по дням",
        "Сравнить долю отказов курьеров в выходные vs будни",
      ],
      missingData: [
        "Отчёт по доступности курьеров",
        "Логи отказов на стороне подрядчика",
      ],
      nextActions: [
        "Связаться с менеджером подрядчика",
        "Проверить, есть ли SLA по выходным",
      ],
      supportingReviewIds: ["r-2"],
    },
    {
      id: "i-2-c",
      statement: "Возможно, проблема связана с пиком предпраздничных заказов, а не с системной нехваткой",
      solutionConfidence: 32,
      confidenceLabel: "низкая",
      whatToCheck: [
        "Сравнить долю переносов в предпраздничные недели vs обычные",
        "Сверить с календарём акций и распродаж",
      ],
      missingData: ["Календарь маркетинговых активностей"],
      nextActions: [
        "Запросить у маркетинга календарь акций",
      ],
      supportingReviewIds: [],
    },
  ],
  "i-4": [
    {
      id: "i-4-a",
      statement: "Возможно, в Customer Care нет настроенного автоэскалейта при просрочке SLA — обращения «зависают»",
      solutionConfidence: 71,
      confidenceLabel: "высокая",
      whatToCheck: [
        "Проверить настройки SLA в Helpdesk",
        "Посмотреть, на какой стадии «зависают» 13 кейсов из жалоб",
        "Сверить, есть ли уведомление руководителю при просрочке",
      ],
      missingData: ["Логи Helpdesk по 13 жалобам", "Карта эскалаций"],
      nextActions: [
        "Запросить у Customer Care настройки SLA",
        "Согласовать пилот автоэскалейта",
      ],
      supportingReviewIds: ["r-3", "r-20"],
    },
    {
      id: "i-4-b",
      statement: "Возможно, сотрудники физически не успевают обработать поток обращений — нужна оценка нагрузки",
      solutionConfidence: 49,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Запросить отчёт по нагрузке на одного оператора",
        "Сравнить количество обращений с числом сотрудников по сменам",
      ],
      missingData: ["Workforce-метрики Customer Care"],
      nextActions: [
        "Запросить у HR и операционки данные по нагрузке",
      ],
      supportingReviewIds: ["r-20"],
    },
    {
      id: "i-4-c",
      statement: "Возможно, гарантийные случаи требуют согласования с производителем, и задержка идёт оттуда",
      solutionConfidence: 36,
      confidenceLabel: "низкая",
      whatToCheck: [
        "Проверить, по каким брендам случаются просрочки",
        "Сверить SLA с производителями",
      ],
      missingData: ["SLA производителей по гарантии"],
      nextActions: [
        "Запросить у юристов договоры с топ-5 поставщиками",
      ],
      supportingReviewIds: [],
    },
  ],
  "i-5": [
    {
      id: "i-5-a",
      statement: "Возможно, в мобильной оплате через App Store при таймауте идёт двойной запрос к шлюзу",
      solutionConfidence: 58,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Запросить логи шлюза по 9 жалобам",
        "Сверить timestamps двойных списаний",
        "Проверить логику ретрая в мобильном клиенте",
      ],
      missingData: ["Логи платёжного шлюза", "Конфиг ретраев в App Store-сборке"],
      nextActions: ["Запросить у Payments выгрузку логов за 30 дней"],
      supportingReviewIds: ["r-12"],
    },
    {
      id: "i-5-b",
      statement: "Возможно, причина в задержке ответа эквайера — пользователь ретраит вручную",
      solutionConfidence: 41,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Замерить время ответа эквайера в моменты жалоб",
        "Сверить процент таймаутов по дням",
      ],
      missingData: ["Метрики времени ответа эквайера"],
      nextActions: ["Подключить мониторинг времени ответа"],
      supportingReviewIds: [],
    },
  ],
};

// Hypothesis statements + next steps + validation plans (kept separately to avoid touching every insight inline)
const INSIGHT_EXTRAS: Record<string, { hypothesisStatement: HypothesisStatement; nextSteps: string[]; validationPlan: ValidationPlan }> = {
  "i-1": {
    hypothesisStatement: {
      ifPart: "ввести обязательную фотофиксацию состояния товара перед отгрузкой и явную маркировку витринных образцов",
      thenPart: "снизится количество жалоб на витринный товар, проданный как новый",
      becausePart: "76% жалоб содержат одинаковую формулировку про «витринный» — клиенты не получают предупреждения о состоянии товара",
    },
    nextSteps: [
      "Согласовать с командой склада регламент фотофиксации",
      "Подготовить шаблон карточки товара с пометкой «витринный»",
      "Запустить пилот в 5 точках Москвы и СПб",
      "Через 4 недели сравнить долю жалоб с базовым периодом",
    ],
    validationPlan: { format: "Пилот в 5 магазинах", duration: "4 недели", metric: "−15% жалоб на витринный товар", teams: ["Склад", "Контроль качества", "Розница"] },
  },
  "i-2": {
    hypothesisStatement: {
      ifPart: "расширить число слотов доставки в выходные и предпраздничные дни",
      thenPart: "снизится число повторных жалоб на перенос сроков",
      becausePart: "67% переносов случается в выходные — слоты переполняются и заказы автоматически переносятся",
    },
    nextSteps: [
      "Сверить данные о фактической загрузке слотов с командой логистики",
      "Договориться с подрядчиком о доп. курьерах в пятницу–субботу",
      "Запустить расширенные слоты в одном городе",
      "Через 2 недели сравнить долю повторных переносов",
    ],
    validationPlan: { format: "Пилот в одном городе", duration: "2 недели", metric: "−25% повторных переносов", teams: ["Логистика", "Подрядчик доставки"] },
  },
  "i-3": {
    hypothesisStatement: {
      ifPart: "добавить упоминание «реальных бонусов» в email-рассылки и шаги оформления заказа",
      thenPart: "вырастет доля положительных упоминаний программы лояльности",
      becausePart: "клиенты уже хвалят программу — усиление коммуникации укрепляет существующий положительный сигнал",
    },
    nextSteps: [
      "Согласовать формулировки с маркетингом и юристами",
      "Подготовить A/B-тест email-рассылки",
      "Замерить рост NPS в когорте через 6 недель",
    ],
    validationPlan: { format: "A/B-тест email + чекаут", duration: "6 недель", metric: "+10% NPS в когорте", teams: ["Маркетинг", "CRM"] },
  },
  "i-4": {
    hypothesisStatement: {
      ifPart: "ввести SLA 48 часов на первый ответ по гарантии и автоматический эскалейт при просрочке",
      thenPart: "снизится количество негативных отзывов про гарантию",
      becausePart: "72% жалоб повторяют сценарий «обещают перезвонить — не перезванивают» при среднем времени ответа 9 дней",
    },
    nextSteps: [
      "Включить SLA 48ч в скрипты Customer Care",
      "Настроить автоэскалейт в Helpdesk при просрочке",
      "Через 4 недели сравнить долю жалоб про гарантию",
    ],
    validationPlan: { format: "Изменение SLA в одной команде", duration: "4 недели", metric: "−20% жалоб на гарантию", teams: ["Клиентский сервис", "QA"] },
  },
  "i-5": {
    hypothesisStatement: {
      ifPart: "проанализировать логи платёжного шлюза и устранить причину двойных списаний",
      thenPart: "снизится количество жалоб на оплату и долгий возврат",
      becausePart: "9 жалоб с одинаковым сценарием за 14 дней — нужны данные шлюза, чтобы подтвердить причину",
    },
    nextSteps: [
      "Запросить логи платёжного шлюза за 30 дней",
      "Сопоставить логи с конкретными жалобами",
      "Сформулировать конкретную техническую гипотезу",
      "Заложить пилотный фикс в спринт",
    ],
    validationPlan: { format: "Технический аудит шлюза", duration: "1 неделя", metric: "Подтверждена/опровергнута причина двойных списаний", teams: ["Платежи", "Backend"] },
  },
  "i-6": {
    hypothesisStatement: {
      ifPart: "стандартизировать практику «распаковка при клиенте» как обязательный пункт чек-листа курьера",
      thenPart: "вырастет средняя оценка last-mile",
      becausePart: "в кластере отзывов фраза «распаковали при мне» коррелирует с оценкой 5★ (0.74)",
    },
    nextSteps: [
      "Обновить инструкцию last-mile",
      "Обучить курьеров на пилоте",
      "Через 4 недели сравнить средний рейтинг",
    ],
    validationPlan: { format: "Пилот с 50 курьерами", duration: "4 недели", metric: "+0.3★ к средней оценке", teams: ["Last Mile"] },
  },
  "i-7": {
    hypothesisStatement: {
      ifPart: "включить проверку серийных номеров через API производителя на категории Аудио",
      thenPart: "снизится число жалоб «серийник не пробивается» и риск серого канала",
      becausePart: "9 одинаковых жалоб за 30 дней с концентрацией в одной категории — высокий риск, но мало данных",
    },
    nextSteps: [
      "Запросить у поставщиков долю возвратов по серийнику",
      "Подключить API проверки от 2 ключевых производителей",
      "Запустить выборочную проверку 100 SKU",
    ],
    validationPlan: { format: "Проверка серийников через API", duration: "3 недели", metric: "Подтверждена/опровергнута гипотеза серого канала", teams: ["QA", "Закупки"] },
  },
  "i-8": {
    hypothesisStatement: {
      ifPart: "добавить дополнительного сотрудника на самовывоз с 18:00 до 20:00",
      thenPart: "снизится время ожидания и вырастет удовлетворённость самовывозом",
      becausePart: "4 отзыва о часовых очередях концентрируются в вечерний пик в одной точке",
    },
    nextSteps: [
      "Согласовать график с управляющим точкой",
      "Замерить очередь до и после",
    ],
    validationPlan: { format: "Эксперимент в одной точке", duration: "2 недели", metric: "−30% времени ожидания", teams: ["Розница"] },
  },
};

export function getInsight(id: string) {
  const i = INSIGHTS.find((i) => i.id === id);
  if (!i) return undefined;
  const extras = INSIGHT_EXTRAS[id];
  return extras ? { ...i, ...extras } : i;
}


export const KPI = {
  totalReviews: REVIEWS.length * 28, // simulate scale
  totalReviewsDelta: 12.4,
  sentimentIndex: Math.round(((REVIEWS.filter(r => r.sentiment === "positive").length - REVIEWS.filter(r => r.sentiment === "negative").length) / REVIEWS.length) * 100),
  sentimentDelta: 8,
  insights: INSIGHTS.length * 9,
  insightsDelta: 22,
  strongInsightsInWork: INSIGHTS.filter(i => i.status === "in_progress" && i.signal > 70).length * 3,
  conversion: 47,
  conversionDelta: 6,
  repeatRate: 38,
  repeatDelta: -4,
  sentimentAfter: 14,
  avgRating: 4.12,
  avgRatingDelta: 0.18,
};

export const IMPACT_CASES = [
  {
    id: "imp-1",
    insightId: "i-6",
    action: "Чек-лист курьера: распаковка при клиенте",
    topicId: "positive",
    deployedAt: dayOffsetISO(28),
    before: { sentiment: 18, rating: 3.9, complaints: 142 },
    after: { sentiment: 41, rating: 4.3, complaints: 89 },
  },
  {
    id: "imp-2",
    insightId: "i-4",
    action: "Перевод гарантии на новый SLA 48ч",
    topicId: "warranty",
    deployedAt: dayOffsetISO(18),
    before: { sentiment: -62, rating: 2.4, complaints: 88 },
    after: { sentiment: -41, rating: 3.1, complaints: 54 },
  },
  {
    id: "imp-3",
    insightId: "i-2",
    action: "Расширение слотов выходного дня",
    topicId: "delay",
    deployedAt: dayOffsetISO(12),
    before: { sentiment: -48, rating: 2.6, complaints: 167 },
    after: { sentiment: -29, rating: 3.0, complaints: 121 },
  },
];
