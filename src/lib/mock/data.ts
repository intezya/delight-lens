// Mock data for AI Review Intelligence
export type Sentiment = "positive" | "negative" | "mixed";
export type TopicKind = "risk" | "opportunity" | "strength";
export type InsightStatus = "new" | "validated" | "in_progress" | "implemented" | "rejected";
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
  return {
    id: `r-${i + 1}`,
    text: seed.text,
    date: dayOffsetISO(daysAgo),
    source: SOURCES[i % SOURCES.length],
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

export type Insight = {
  id: string;
  title: string;
  description: string;
  topicId: string;
  status: InsightStatus;
  impact: InsightImpact;
  confidence: number;
  signal: number;
  expectedEffect: string;
  priority: Priority;
  owner: { name: string; team: string };
  createdAt: string;
  reviewIds: string[];
};

export const INSIGHTS: Insight[] = [
  {
    id: "i-1",
    title: "Витринный товар продаётся как новый",
    description: "AI выявил 14 повторяющихся жалоб на B2C-продажу витринных образцов под видом нового товара. Концентрация на категории «Электроника» в Москве и СПб.",
    topicId: "defective",
    status: "validated",
    impact: "down_neg",
    confidence: 92,
    signal: 88,
    expectedEffect: "−18% негатива в категории за 4 недели",
    priority: "critical",
    owner: { name: "Мария В.", team: "Retail Ops" },
    createdAt: dayOffsetISO(6),
    reviewIds: ["r-1", "r-10"],
  },
  {
    id: "i-2",
    title: "Срыв сроков доставки кратно растёт по выходным",
    description: "Кластер из 17 отзывов о переносе доставки 3+ раз. Корреляция с пятницей и предпраздничными днями — слот переполнения склада.",
    topicId: "delay",
    status: "in_progress",
    impact: "down_repeat",
    confidence: 86,
    signal: 79,
    expectedEffect: "−25% повторных жалоб на сроки",
    priority: "high",
    owner: { name: "Дмитрий П.", team: "Logistics" },
    createdAt: dayOffsetISO(11),
    reviewIds: ["r-9"],
  },
  {
    id: "i-3",
    title: "Программа лояльности — главный driver позитива",
    description: "В 76 положительных отзывах упоминаются «реальные бонусы» и «накопления с 2014». Можно усилить коммуникацию и конвертировать в NPS.",
    topicId: "loyalty-bonus",
    status: "new",
    impact: "up_pos",
    confidence: 81,
    signal: 76,
    expectedEffect: "+12% позитивных упоминаний",
    priority: "medium",
    owner: { name: "Ольга С.", team: "Marketing" },
    createdAt: dayOffsetISO(3),
    reviewIds: ["r-7", "r-16"],
  },
  {
    id: "i-4",
    title: "Гарантийный отдел: SLA нарушен в 38% обращений",
    description: "AI сгруппировал 13 жалоб с одинаковым сценарием: «звонишь — обещают перезвонить — не перезванивают». Среднее время до ответа — 9 дней.",
    topicId: "warranty",
    status: "in_progress",
    impact: "down_neg",
    confidence: 89,
    signal: 84,
    expectedEffect: "−22% негатива по гарантии",
    priority: "critical",
    owner: { name: "Иван Н.", team: "Customer Care" },
    createdAt: dayOffsetISO(14),
    reviewIds: ["r-3", "r-20"],
  },
  {
    id: "i-5",
    title: "Двойное списание при ошибке оплаты",
    description: "9 одинаковых сценариев: оплата не проходит, деньги списываются, заказ не оформляется. Ждут возврат 14 дней.",
    topicId: "payment",
    status: "validated",
    impact: "down_neg",
    confidence: 94,
    signal: 73,
    expectedEffect: "−30% жалоб на оплату",
    priority: "high",
    owner: { name: "Сергей М.", team: "Payments" },
    createdAt: dayOffsetISO(8),
    reviewIds: ["r-12"],
  },
  {
    id: "i-6",
    title: "Курьеры с распаковкой — рост позитива",
    description: "Упоминание «распаковали при мне» сильно коррелирует с 5★. Можно стандартизировать как чек-лист курьера.",
    topicId: "positive",
    status: "implemented",
    impact: "up_rating",
    confidence: 78,
    signal: 61,
    expectedEffect: "+0.3★ средняя оценка",
    priority: "medium",
    owner: { name: "Екатерина Р.", team: "Last Mile" },
    createdAt: dayOffsetISO(28),
    reviewIds: ["r-13"],
  },
  {
    id: "i-7",
    title: "Подозрение на серый канал поставок",
    description: "Кластер «серийник не пробивается» — 9 отзывов за 30 дней. Концентрация в категории «Аудио».",
    topicId: "fake",
    status: "new",
    impact: "down_neg",
    confidence: 71,
    signal: 84,
    expectedEffect: "−15% жалоб на подделки",
    priority: "critical",
    owner: { name: "Алексей К.", team: "Quality" },
    createdAt: dayOffsetISO(2),
    reviewIds: ["r-8"],
  },
  {
    id: "i-8",
    title: "Очереди на самовывозе в час пик",
    description: "Смешанные отзывы с темой «час очереди» — 4 повтора. Решение: дополнительный сотрудник 18:00–20:00.",
    topicId: "service-quality",
    status: "rejected",
    impact: "up_sat",
    confidence: 64,
    signal: 44,
    expectedEffect: "+5% удовлетворённости",
    priority: "low",
    owner: { name: "Анна Б.", team: "Retail Ops" },
    createdAt: dayOffsetISO(20),
    reviewIds: ["r-19"],
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

export function getInsight(id: string) {
  return INSIGHTS.find((i) => i.id === id);
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
