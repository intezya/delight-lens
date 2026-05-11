// Mock data for AI Review Intelligence
export type Sentiment = "positive" | "negative" | "mixed";
export type TopicKind = "risk" | "opportunity" | "strength";
export type InsightStatus =
  | "new"
  | "validated"
  | "in_progress"
  | "implemented"
  | "rejected"
  | "needs_data";
export type InsightImpact = "down_neg" | "up_pos" | "down_repeat" | "up_sat" | "up_rating";
export type Source = "Я.Маркет" | "Otzovik" | "2GIS" | "Google Maps" | "Trustpilot" | "App Store";
export type Priority = "low" | "medium" | "high" | "critical";

export const SOURCES: Source[] = [
  "Я.Маркет",
  "Otzovik",
  "2GIS",
  "Google Maps",
  "Trustpilot",
  "App Store",
];

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
  "Я.Маркет": "https://reviews.yandex.ru/shop/mvideo.ru?reviewId=",
  Otzovik:
    "https://otzovik.com/reviews/dns-shop_ru-internet-magazin_bitovoy_tehniki_i_elektroniki/",
  "2GIS": "https://2gis.ru/moscow/firm/4504127908356157/tab/reviews?reviewId=",
  "Google Maps": "https://www.google.com/maps/contrib/reviews/",
  Trustpilot: "https://www.trustpilot.com/reviews/",
  "App Store": "https://apps.apple.com/ru/app/id000/reviews?reviewId=",
};

// Source-informed paraphrases: keeps the demo grounded without copying public reviews verbatim.
const reviewSeeds: Array<
  Partial<Review> & { text: string; sentiment: Sentiment; topics: string[] }
> = [
  {
    text: "Крупную технику привезли с повреждённой упаковкой, курьеры торопили подписать акт и не дали спокойно проверить корпус. Товар работает, но доверие к доставке пропало.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/moscow/firm/4504127908356157/tab/reviews",
    sentiment: "mixed",
    topics: ["delivery-damage", "delay", "support"],
    rating: 3,
    signal: 78,
    repeatCount: 12,
    priority: "high",
  },
  {
    text: "В приложении выбрал доставку на субботу, после оплаты дату перенесли дважды. В чате каждый раз предлагают ждать звонка оператора, но никто не перезванивает.",
    source: "Я.Маркет",
    sourceUrl: "https://reviews.yandex.ru/shop/mvideo.ru",
    sentiment: "negative",
    topics: ["delay", "order-process", "support"],
    rating: 1,
    signal: 89,
    repeatCount: 21,
    priority: "critical",
  },
  {
    text: "На выдаче выяснилось, что планшет уже вскрывали: плёнки переклеены, на корпусе следы, а продавец говорит, что это новый товар. От покупки отказался.",
    source: "Otzovik",
    sourceUrl: "https://otzovik.com/reviews/set_magazinov_kompyuternoy_tehniki_dns_russia/",
    sentiment: "negative",
    topics: ["defective", "fraud"],
    rating: 1,
    signal: 94,
    repeatCount: 18,
    priority: "critical",
  },
  {
    text: "Покупала смартфон в рассрочку, в чеке появились подписка и дополнительная гарантия, которые отдельно не согласовывали. Разобраться на стойке не получилось.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/togliatti/firm/3096753024862997/tab/reviews",
    sentiment: "negative",
    topics: ["fraud", "payment", "service-quality"],
    rating: 1,
    signal: 91,
    repeatCount: 16,
    priority: "critical",
  },
  {
    text: "Гарантийный отдел принял технику на проверку и пропал. В поддержке видят обращение, но не могут сказать статус и переводят между магазином и сервисом.",
    source: "Otzovik",
    sourceUrl:
      "https://otzovik.com/reviews/dns-shop_ru-internet-magazin_bitovoy_tehniki_i_elektroniki/",
    sentiment: "negative",
    topics: ["warranty", "support"],
    rating: 1,
    signal: 88,
    repeatCount: 19,
    priority: "critical",
  },
  {
    text: "Заказ из интернет-магазина нельзя получить по коду из письма: письмо ведёт в личный кабинет, а код выдачи спрятан глубже. На пункте выдачи помогли не сразу.",
    source: "Я.Маркет",
    sourceUrl: "https://reviews.yandex.ru/shop/dns-shop.ru",
    sentiment: "mixed",
    topics: ["order-process", "support"],
    rating: 3,
    signal: 62,
    repeatCount: 8,
    priority: "medium",
  },
  {
    text: "Понравилось, что консультант быстро сравнил несколько моделей, не навязывал лишнее и помог оформить самовывоз за 10 минут.",
    source: "Google Maps",
    sentiment: "positive",
    topics: ["positive", "service-quality"],
    rating: 5,
    signal: 54,
    repeatCount: 0,
    priority: "low",
  },
  {
    text: "Бонусы реально списались при оплате, остаток сразу отобразился в приложении. На фоне маркетплейсов это понятная и честная программа лояльности.",
    source: "Я.Маркет",
    sourceUrl: "https://reviews.yandex.ru/shop/mvideo.ru",
    sentiment: "positive",
    topics: ["loyalty-bonus", "brand-strength"],
    rating: 5,
    signal: 82,
    repeatCount: 0,
    priority: "low",
  },
  {
    text: "Накопленные бонусы не дали списать из-за новой акции: итоговая цена стала выше, чем если бы акции не было. Оператор объяснил правила только после отмены заказа.",
    source: "Otzovik",
    sourceUrl: "https://otzovik.com/review_18189660.html",
    sentiment: "negative",
    topics: ["loyalty-bonus", "price", "support"],
    rating: 2,
    signal: 76,
    repeatCount: 11,
    priority: "high",
  },
  {
    text: "В магазине ценник выше, чем на сайте, а экран для онлайн-заказа показывает третью цену. Сотрудники в итоге помогли, но сравнение заняло полчаса.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/moscow/firm/4504127918397613/tab/reviews",
    sentiment: "mixed",
    topics: ["price", "service-quality"],
    rating: 3,
    signal: 69,
    repeatCount: 13,
    priority: "medium",
  },
  {
    text: "Курьер приехал в заявленный интервал, сам предложил проверить комплектацию и распаковать товар при мне. После такого не страшно брать дорогую технику.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/sochi/firm/4222652931836762/tab/reviews",
    sentiment: "positive",
    topics: ["positive", "delivery-damage"],
    rating: 5,
    signal: 71,
    repeatCount: 0,
    priority: "low",
  },
  {
    text: "Телевизор начал зависать через несколько дней, магазин отправил на диагностику и вернул с формулировкой «исправен». Претензию потеряли, статуса нет.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/sochi/firm/4222652931836762/tab/reviews",
    sentiment: "negative",
    topics: ["warranty", "defective", "support"],
    rating: 1,
    signal: 90,
    repeatCount: 15,
    priority: "critical",
  },
  {
    text: "Серийный номер наушников не проходит проверку у производителя. В магазине предлагают обращаться в поддержку, поддержка просит принести товар обратно.",
    source: "Otzovik",
    sourceUrl: "https://otzovik.com/reviews/set_magazinov_kompyuternoy_tehniki_dns_russia/",
    sentiment: "negative",
    topics: ["fake", "warranty", "support"],
    rating: 1,
    signal: 86,
    repeatCount: 10,
    priority: "critical",
  },
  {
    text: "После неуспешной оплаты деньги списались, заказ не создался. Поддержка говорит ждать возврата до двух недель, хотя товар нужен был срочно.",
    source: "App Store",
    sentiment: "negative",
    topics: ["payment", "order-process", "support"],
    rating: 1,
    signal: 83,
    repeatCount: 14,
    priority: "high",
  },
  {
    text: "Самовывоз удобный, но вечером очередь почти час: один сотрудник ищет заказы, второй оформляет возвраты. Для срочной покупки это ломает сценарий.",
    source: "Google Maps",
    sentiment: "mixed",
    topics: ["service-quality", "order-process"],
    rating: 3,
    signal: 66,
    repeatCount: 9,
    priority: "medium",
  },
  {
    text: "Хороший выбор комплектующих, консультант честно сказал, какие позиции стоит брать в магазине, а какие дешевле заказать онлайн. Вернусь ещё.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/novorossiysk/firm/70000001041676748/tab/reviews",
    sentiment: "positive",
    topics: ["positive", "price", "brand-strength"],
    rating: 5,
    signal: 58,
    repeatCount: 0,
    priority: "low",
  },
  {
    text: "Доставка крупного холодильника внезапно стала дороже уже на месте: курьеры объяснили подъёмом и упаковкой. В заказе такие условия не были очевидны.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/moscow/firm/4504127908356157/tab/reviews",
    sentiment: "negative",
    topics: ["delivery-damage", "payment", "bad-service"],
    rating: 2,
    signal: 79,
    repeatCount: 12,
    priority: "high",
  },
  {
    text: "Заказ оплатил заранее, в день доставки выяснилось, что одной позиции нет на складе. Горячая линия оставила обращение и предложила ждать неделю.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/podolsk/firm/70000001007389556/tab/reviews",
    sentiment: "negative",
    topics: ["not-given", "delay", "support"],
    rating: 1,
    signal: 85,
    repeatCount: 17,
    priority: "critical",
  },
  {
    text: "В приложении бот не даёт поменять дату доставки, а оператор просит обратиться именно в магазин покупки. После оплаты клиент остаётся без понятного владельца вопроса.",
    source: "App Store",
    sentiment: "negative",
    topics: ["order-process", "delay", "support"],
    rating: 1,
    signal: 87,
    repeatCount: 18,
    priority: "critical",
  },
  {
    text: "Товар был дешевле, чем у конкурентов, доставка на следующий день, коробка целая. Нормальный опыт без сюрпризов.",
    source: "Я.Маркет",
    sourceUrl: "https://reviews.yandex.ru/shop/dns-shop.ru",
    sentiment: "positive",
    topics: ["positive", "price"],
    rating: 5,
    signal: 51,
    repeatCount: 0,
    priority: "low",
  },
  {
    text: "Гарантия «лучшей цены» не сработала: ссылку на конкурента не приняли, хотя разница была заметная. Правила акции выглядят слишком узкими.",
    source: "Otzovik",
    sourceUrl:
      "https://otzovik.com/reviews/dns-shop_ru-internet-magazin_bitovoy_tehniki_i_elektroniki/",
    sentiment: "negative",
    topics: ["price", "fraud", "support"],
    rating: 2,
    signal: 72,
    repeatCount: 7,
    priority: "medium",
  },
  {
    text: "Отзыв о сервисном центре резко негативный: товар вернули после ремонта с другой проблемой, а заявление на замену закрыли формальным отказом.",
    source: "Otzovik",
    sourceUrl:
      "https://otzovik.com/reviews/dns-shop_ru-internet-magazin_bitovoy_tehniki_i_elektroniki/",
    sentiment: "negative",
    topics: ["warranty", "defective", "legal"],
    rating: 1,
    signal: 88,
    repeatCount: 13,
    priority: "critical",
  },
  {
    text: "Заказ готов к выдаче по статусу, но в магазине его долго ищут и в итоге предлагают прийти завтра. Клиентский путь между сайтом и точкой разваливается.",
    source: "Google Maps",
    sentiment: "negative",
    topics: ["order-process", "service-quality", "not-given"],
    rating: 2,
    signal: 74,
    repeatCount: 10,
    priority: "high",
  },
  {
    text: "Поддержка в чате отвечает быстро, прислали инструкцию по возврату и сразу оформили заявку. Редкий случай, когда всё понятно с первого контакта.",
    source: "Trustpilot",
    sentiment: "positive",
    topics: ["positive", "support"],
    rating: 5,
    signal: 57,
    repeatCount: 0,
    priority: "low",
  },
  {
    text: "После покупки дорогой техники в чеке обнаружились услуги, которые презентовали как обязательные для одобрения рассрочки. Документы длинные, отказаться сложно.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/togliatti/firm/3096753024862997/tab/reviews",
    sentiment: "negative",
    topics: ["fraud", "payment", "legal"],
    rating: 1,
    signal: 92,
    repeatCount: 15,
    priority: "critical",
  },
  {
    text: "Заказанный товар пришёл быстро, но пункт выдачи закрывается раньше, чем удобно после работы. Приходится переносить получение на выходные.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/novorossiysk/firm/70000001041676748/tab/reviews",
    sentiment: "mixed",
    topics: ["order-process", "service-quality"],
    rating: 4,
    signal: 48,
    repeatCount: 5,
    priority: "low",
  },
  {
    text: "На сайте товар был в наличии, после оплаты статус завис в обработке. Поддержка пишет, что заказ «сложный», но не называет срок.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/cheboksary/firm/70000001031396896/tab/reviews",
    sentiment: "negative",
    topics: ["delay", "order-process", "support"],
    rating: 1,
    signal: 80,
    repeatCount: 14,
    priority: "high",
  },
  {
    text: "Ассортимент большой, приложение удобное, часто нахожу кабели и мелкую технику дешевле, чем в соседних магазинах.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/sochi/firm/4222652931836762/tab/reviews",
    sentiment: "positive",
    topics: ["positive", "price", "brand-strength"],
    rating: 5,
    signal: 50,
    repeatCount: 0,
    priority: "low",
  },
  {
    text: "Сотрудник не смог объяснить разницу между моделями и просто читал ценник. Для сложной техники хочется консультации, а не пересказа карточки.",
    source: "2GIS",
    sourceUrl: "https://2gis.ru/novorossiysk/firm/70000001041676748/tab/reviews",
    sentiment: "negative",
    topics: ["bad-service", "service-quality"],
    rating: 2,
    signal: 63,
    repeatCount: 8,
    priority: "medium",
  },
  {
    text: "Товар доставили с витрины, предупредили только после оплаты. Скидка не компенсирует ощущение, что выбор состояния товара скрыли.",
    source: "Я.Маркет",
    sourceUrl: "https://reviews.yandex.ru/shop/mvideo.ru",
    sentiment: "negative",
    topics: ["defective", "fraud", "price"],
    rating: 1,
    signal: 90,
    repeatCount: 16,
    priority: "critical",
  },
  {
    text: "Мобильное приложение удобно показывает бонусы и историю заказов, но при спорном возврате всё равно приходится идти в магазин.",
    source: "App Store",
    sentiment: "mixed",
    topics: ["loyalty-bonus", "support", "warranty"],
    rating: 3,
    signal: 61,
    repeatCount: 7,
    priority: "medium",
  },
  {
    text: "Покупка прошла спокойно: оплатил в приложении, через 15 минут забрал в магазине, сотрудник проверил комплектность.",
    source: "Google Maps",
    sentiment: "positive",
    topics: ["positive", "order-process"],
    rating: 5,
    signal: 55,
    repeatCount: 0,
    priority: "low",
  },
  {
    text: "Технику с дефектом отправляют в сервис вместо быстрой замены, хотя проблема проявилась почти сразу. Клиент остаётся без товара и без срока решения.",
    source: "Я.Маркет",
    sourceUrl: "https://reviews.yandex.ru/shop/dns-shop.ru",
    sentiment: "negative",
    topics: ["defective", "warranty", "support"],
    rating: 1,
    signal: 87,
    repeatCount: 18,
    priority: "critical",
  },
];

const REGIONS = ["Москва", "СПб", "Екатеринбург", "Казань", "Новосибирск", "Краснодар"];
const CATEGORIES = ["Электроника", "Бытовая техника", "Аудио", "Уход", "Компьютеры"];
const AUTHORS = [
  "Алексей К.",
  "Мария В.",
  "Дмитрий П.",
  "Ольга С.",
  "Иван Н.",
  "Екатерина Р.",
  "Сергей М.",
  "Анна Б.",
];

function dayOffsetISO(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export const REVIEWS: Review[] = Array.from({ length: 64 }).map((_, i) => {
  const seed = reviewSeeds[i % reviewSeeds.length];
  const daysAgo = Math.floor((i * 1.4) % 89);
  const source = seed.source ?? SOURCES[i % SOURCES.length];
  const id = `r-${i + 1}`;
  return {
    id,
    text: seed.text,
    date: dayOffsetISO(daysAgo),
    source,
    sourceUrl: seed.sourceUrl ?? `${SOURCE_URL_BASE[source]}${id}`,
    sentiment: seed.sentiment,
    rating: seed.rating ?? 3,
    topics: seed.topics,
    signal: seed.signal ?? 50,
    repeatCount: seed.repeatCount ?? 0,
    priority: seed.priority ?? "medium",
    linkedToKnown: (seed.repeatCount ?? 0) > 4,
    region: seed.region ?? REGIONS[i % REGIONS.length],
    category: seed.category ?? CATEGORIES[i % CATEGORIES.length],
    author: seed.author ?? AUTHORS[i % AUTHORS.length],
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
  Otzovik: +(3.4 + Math.cos(d.total / 12) * 0.25).toFixed(2),
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
  Logistics: "Команда доставки",
  Marketing: "Команда маркетинга",
  "Customer Care": "Команда клиентского сервиса",
  Payments: "Команда платежей",
  "Last Mile": "Команда последней мили",
  Quality: "Команда контроля качества",
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
  {
    id: "delivery_delay",
    topicId: "delay",
    name: "Срыв сроков доставки",
    reviewsCount: 42,
    trend: "+23%",
  },
  {
    id: "courier_no_show",
    topicId: "delay",
    name: "Курьер не приехал",
    reviewsCount: 21,
    trend: "+8%",
  },
  {
    id: "delivery_reschedule",
    topicId: "delay",
    name: "Перенос без предупреждения",
    reviewsCount: 14,
    trend: "+12%",
  },
  {
    id: "app_reschedule_block",
    topicId: "order-process",
    name: "Нельзя перенести доставку после оплаты",
    reviewsCount: 28,
    trend: "+31%",
  },
  {
    id: "package_damage",
    topicId: "delivery-damage",
    name: "Повреждение упаковки",
    reviewsCount: 17,
    trend: "+4%",
  },
  {
    id: "showroom_as_new",
    topicId: "defective",
    name: "Витринный товар как новый",
    reviewsCount: 14,
    trend: "+18%",
  },
  {
    id: "broken_on_arrival",
    topicId: "defective",
    name: "Брак при получении",
    reviewsCount: 11,
    trend: "+6%",
  },
  {
    id: "warranty_sla",
    topicId: "warranty",
    name: "Просрочка SLA по гарантии",
    reviewsCount: 13,
    trend: "+9%",
  },
  {
    id: "warranty_refusal",
    topicId: "warranty",
    name: "Отказ в гарантии",
    reviewsCount: 7,
    trend: "−3%",
  },
  {
    id: "double_charge",
    topicId: "payment",
    name: "Двойное списание",
    reviewsCount: 9,
    trend: "+11%",
  },
  {
    id: "hidden_addons",
    topicId: "fraud",
    name: "Допуслуги в чеке без явного согласия",
    reviewsCount: 31,
    trend: "+27%",
  },
  {
    id: "price_mismatch",
    topicId: "price",
    name: "Разные цены сайт / магазин / терминал",
    reviewsCount: 24,
    trend: "+16%",
  },
  {
    id: "support_context_loss",
    topicId: "support",
    name: "Поддержка теряет контекст обращения",
    reviewsCount: 36,
    trend: "+19%",
  },
  {
    id: "pickup_status_gap",
    topicId: "order-process",
    name: "Статус «готов» не совпадает с точкой",
    reviewsCount: 18,
    trend: "+12%",
  },
  {
    id: "loyalty_bonuses",
    topicId: "loyalty-bonus",
    name: "Реальные бонусы",
    reviewsCount: 32,
    trend: "+14%",
  },
  {
    id: "bonus_conflict",
    topicId: "loyalty-bonus",
    name: "Акция блокирует накопленные бонусы",
    reviewsCount: 16,
    trend: "+9%",
  },
  {
    id: "fake_serial",
    topicId: "fake",
    name: "Серийник не пробивается",
    reviewsCount: 9,
    trend: "+22%",
  },
  {
    id: "queue_pickup",
    topicId: "service-quality",
    name: "Очереди в самовывозе",
    reviewsCount: 4,
    trend: "+1%",
  },
  {
    id: "courier_unboxing",
    topicId: "positive",
    name: "Распаковка при клиенте",
    reviewsCount: 18,
    trend: "+7%",
  },
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
    description:
      "AI выявил 14 повторяющихся жалоб на B2C-продажу витринных образцов под видом нового товара. Концентрация на категории «Электроника» в Москве и СПб.",
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
    reviewIds: ["r-3", "r-30", "r-12"],
    confidenceBreakdown: cb(38, [
      {
        label: "Объём отзывов",
        score: 28,
        description: "38 отзывов за 30 дней — устойчивый сигнал",
      },
      {
        label: "Повторяемость",
        score: 22,
        description: "В 76% жалоб одинаковая формулировка про «витринный»",
      },
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
      { reviewId: "r-3", highlight: "планшет уже вскрывали: плёнки переклеены, на корпусе следы" },
      {
        reviewId: "r-30",
        highlight: "Товар доставили с витрины, предупредили только после оплаты",
      },
      {
        reviewId: "r-12",
        highlight: "магазин отправил на диагностику и вернул с формулировкой «исправен»",
      },
    ],
    risks: [
      "Часть жалоб может относиться к повреждениям при транспортировке, а не к витринным образцам",
      "Концентрация в Москве и СПб может быть смещением выборки",
      "Нет данных от службы приёмки о статусе товара",
    ],
    ownerTeam: "Retail Ops",
    recommendedAction: "Передать команде складского контроля",
    taskDescription:
      "Ввести фотофиксацию состояния товара перед отгрузкой и обязательную маркировку витринных образцов",
  },
  {
    id: "i-2",
    title: "Срыв сроков доставки кратно растёт по выходным",
    description:
      "Кластер из 17 отзывов о переносе доставки 3+ раз. Корреляция с пятницей и предпраздничными днями — слот переполнения склада.",
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
    reviewIds: ["r-2", "r-18", "r-19"],
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
      { reviewId: "r-2", highlight: "дату перенесли дважды, в чате предлагают ждать звонка" },
      {
        reviewId: "r-18",
        highlight: "одной позиции нет на складе, горячая линия предложила ждать неделю",
      },
      { reviewId: "r-19", highlight: "бот не даёт поменять дату доставки" },
    ],
    risks: [
      "Часть жалоб может относиться не к доставке, а к работе склада",
      "Пик может быть связан с праздниками, а не с системной проблемой",
      "Недостаточно данных по фактическим отменам заказов",
    ],
    ownerTeam: "Logistics",
    recommendedAction: "Передать команде доставки",
    taskDescription:
      "Проверить причины переносов заказов в выходные и предпраздничные дни, расширить слоты выходного дня",
  },
  {
    id: "i-3",
    title: "Программа лояльности — главный driver позитива",
    description:
      "В 76 положительных отзывах упоминаются «реальные бонусы» и «накопления с 2014». Можно усилить коммуникацию и конвертировать в NPS.",
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
    reviewIds: ["r-8", "r-9", "r-31"],
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
      { reviewId: "r-8", highlight: "Бонусы реально списались при оплате" },
      { reviewId: "r-9", highlight: "Накопленные бонусы не дали списать из-за новой акции" },
      { reviewId: "r-31", highlight: "удобно показывает бонусы и историю заказов" },
    ],
    risks: [
      "Усиленная коммуникация может вызвать рост ожиданий и негатив, если изменятся условия",
      "Не все каналы маркетинга подходят для такой темы",
    ],
    ownerTeam: "Marketing",
    recommendedAction: "Передать в маркетинг для усиления коммуникации",
    taskDescription:
      "Включить тезисы о бонусах в email-рассылки и оформление заказа, запустить A/B-тест",
  },
  {
    id: "i-4",
    title: "Гарантийный отдел: SLA нарушен в 38% обращений",
    description:
      "AI сгруппировал 13 жалоб с одинаковым сценарием: «звонишь — обещают перезвонить — не перезванивают». Среднее время до ответа — 9 дней.",
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
    reviewIds: ["r-5", "r-12", "r-22", "r-33"],
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
      { reviewId: "r-5", highlight: "гарантийный отдел принял технику на проверку и пропал" },
      { reviewId: "r-12", highlight: "претензию потеряли, статуса нет" },
      { reviewId: "r-22", highlight: "товар вернули после ремонта с другой проблемой" },
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
    description:
      "9 одинаковых сценариев: оплата не проходит, деньги списываются, заказ не оформляется. Ждут возврат 14 дней.",
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
    reviewIds: ["r-14"],
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
    evidenceReviews: [{ reviewId: "r-14", highlight: "деньги списались, заказ не создался" }],
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
    description:
      "Упоминание «распаковали при мне» сильно коррелирует с 5★. Можно стандартизировать как чек-лист курьера.",
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
    reviewIds: ["r-11"],
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
      {
        reviewId: "r-11",
        highlight: "курьер сам предложил проверить комплектацию и распаковать товар",
      },
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
    description:
      "Кластер «серийник не пробивается» — 9 отзывов за 30 дней. Концентрация в категории «Аудио».",
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
    reviewIds: ["r-13"],
    confidenceBreakdown: cb(9, [
      { label: "Объём отзывов", score: 14, description: "Кластер небольшой, но критичный" },
      {
        label: "Повторяемость",
        score: 22,
        description: "Одинаковая формулировка про серийный номер",
      },
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
      { reviewId: "r-13", highlight: "серийный номер не проходит проверку у производителя" },
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
    description:
      "Смешанные отзывы с темой «час очереди» — 4 повтора. Решение: дополнительный сотрудник 18:00–20:00.",
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
    reviewIds: ["r-15", "r-26"],
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
      { reviewId: "r-15", highlight: "вечером очередь почти час" },
      { reviewId: "r-26", highlight: "пункт выдачи закрывается раньше, чем удобно после работы" },
    ],
    risks: ["Маленький кластер — статистически слабый", "Возможно, проблема разовая"],
    ownerTeam: "Retail Ops",
    recommendedAction: "Не передавать в работу — недостаточно сигнала",
    taskDescription: "Возврат к теме при росте кластера до 10+ отзывов",
  },
  {
    id: "i-9",
    title: "Допуслуги попадают в чек без явного согласия",
    description:
      "Кластер из 31 отзыва: клиенты обнаруживают подписки, страховки или расширенную гарантию уже после оформления рассрочки или оплаты.",
    topicId: "fraud",
    subtopicId: "hidden_addons",
    status: "validated",
    impact: "down_neg",
    confidence: 87,
    signal: 91,
    expectedEffect: "−18…28% жалоб на навязанные услуги",
    priority: "critical",
    owner: { name: "Мария В.", team: "Retail Ops" },
    createdAt: dayOffsetISO(4),
    reviewIds: ["r-4", "r-25"],
    confidenceBreakdown: cb(31, [
      { label: "Объём отзывов", score: 24, description: "31 отзыв в 2GIS, Я.Маркет и Otzovik" },
      {
        label: "Повторяемость",
        score: 25,
        description: "В 69% сообщений есть сценарий «нашёл в чеке после оплаты»",
      },
      { label: "Тональность", score: 18, description: "92% отзывов — резко негативные" },
      {
        label: "Разные источники",
        score: 12,
        description: "Сигнал повторяется в магазинах и онлайн-оформлении",
      },
      { label: "Свежесть", score: 8, description: "Рост за последние 3 недели" },
    ]),
    expectedEffectV2: {
      type: "complaints_reduction",
      range: { min: 18, max: 28 },
      unit: "%",
      label: "средний-высокий",
      reason: "Сценарий хорошо локализован: согласие на допуслугу теряется на шаге оформления",
    },
    generationReason: [
      "31 отзыв с упоминанием подписок, страховок или гарантий в чеке",
      "Ключевой триггер — рассрочка и покупка дорогой техники",
      "Клиенты не понимают, где именно дали согласие",
      "Повторы есть в 2GIS, Otzovik и Яндекс Reviews",
    ],
    evidenceReviews: [
      { reviewId: "r-4", highlight: "в чеке появились подписка и дополнительная гарантия" },
      {
        reviewId: "r-25",
        highlight: "услуги презентовали как обязательные для одобрения рассрочки",
      },
    ],
    risks: [
      "Часть клиентов могла согласиться формально, но не понять условия",
      "Нужны чеки и записи оформления для подтверждения нарушения процесса",
      "Регуляторный риск выше обычного продуктового дефекта",
    ],
    ownerTeam: "Retail Ops",
    recommendedAction: "Передать Retail Ops и юридической команде",
    taskDescription: "Добавить явный экран согласия на каждую допуслугу и аудит чеков по рассрочке",
  },
  {
    id: "i-10",
    title: "После оплаты клиент не может перенести доставку",
    description:
      "28 отзывов описывают один сценарий: дата доставки нужна раньше или позже, но приложение, бот и магазин отправляют клиента друг к другу.",
    topicId: "order-process",
    subtopicId: "app_reschedule_block",
    status: "new",
    impact: "down_repeat",
    confidence: 82,
    signal: 87,
    expectedEffect: "−20…32% повторных обращений по доставке",
    priority: "high",
    owner: { name: "Дмитрий П.", team: "Logistics" },
    createdAt: dayOffsetISO(5),
    reviewIds: ["r-19", "r-2"],
    confidenceBreakdown: cb(28, [
      { label: "Объём отзывов", score: 22, description: "28 отзывов за 30 дней" },
      {
        label: "Повторяемость",
        score: 23,
        description: "Одинаковая цепочка: приложение → бот → магазин → оператор",
      },
      { label: "Тональность", score: 17, description: "85% негативные" },
      { label: "Разные источники", score: 11, description: "App Store, 2GIS и Яндекс Reviews" },
      { label: "Свежесть", score: 9, description: "Рост на 31% в последнюю неделю" },
    ]),
    expectedEffectV2: {
      type: "repeat_reduction",
      range: { min: 20, max: 32 },
      unit: "%",
      label: "средний-высокий",
      reason:
        "Сейчас клиент создаёт несколько обращений по одному заказу — self-service перенос должен снять повторные контакты",
    },
    generationReason: [
      "28 отзывов говорят о невозможности перенести доставку после оплаты",
      "В 64% случаев клиент упоминает сразу два канала поддержки",
      "Главная боль — отсутствие владельца вопроса после оплаты",
    ],
    evidenceReviews: [
      { reviewId: "r-19", highlight: "бот не даёт поменять дату доставки" },
      { reviewId: "r-2", highlight: "дату перенесли дважды, в чате предлагают ждать звонка" },
    ],
    risks: [
      "Ограничения могут быть связаны с реальными SLA подрядчиков доставки",
      "Нужны правила блокировки слотов после оплаты",
    ],
    neededData: [
      "Логи изменения доставки после оплаты",
      "Причины отказа self-service переноса в приложении",
      "Доля повторных обращений по одному заказу",
    ],
    ownerTeam: "Logistics",
    recommendedAction: "Передать Logistics и мобильной команде",
    taskDescription:
      "Проверить правила изменения слота после оплаты и спроектировать self-service перенос",
  },
  {
    id: "i-11",
    title: "Разные цены в онлайне, магазине и терминале ломают доверие",
    description:
      "24 отзыва указывают на расхождение цены между сайтом, залом и терминалом. Клиенты тратят время на доказательство актуальной цены.",
    topicId: "price",
    subtopicId: "price_mismatch",
    status: "new",
    impact: "up_sat",
    confidence: 79,
    signal: 76,
    expectedEffect: "+5…9% удовлетворённости покупкой",
    priority: "medium",
    owner: { name: "Ольга С.", team: "Marketing" },
    createdAt: dayOffsetISO(9),
    reviewIds: ["r-10", "r-21"],
    confidenceBreakdown: cb(24, [
      { label: "Объём отзывов", score: 20, description: "24 отзыва с расхождением цены" },
      {
        label: "Повторяемость",
        score: 20,
        description: "Повторяется триада: сайт, ценник, терминал",
      },
      {
        label: "Тональность",
        score: 13,
        description: "Много смешанных отзывов: проблему часто решают, но осадок остаётся",
      },
      { label: "Разные источники", score: 12, description: "2GIS, Otzovik и Яндекс Reviews" },
      { label: "Свежесть", score: 8, description: "Тренд растёт на 16%" },
    ]),
    expectedEffectV2: {
      type: "positive_uplift",
      range: { min: 5, max: 9 },
      unit: "%",
      label: "средний",
      reason:
        "Это не самый критичный кластер, но он влияет на доверие к акции и конверсию в магазине",
    },
    generationReason: [
      "24 отзыва о расхождении цены в разных каналах",
      "Проблема чаще всего появляется на акционных товарах",
      "Часть отзывов остаётся смешанной, потому что сотрудники помогают вручную",
    ],
    evidenceReviews: [
      {
        reviewId: "r-10",
        highlight: "ценник выше, чем на сайте, а терминал показывает третью цену",
      },
      { reviewId: "r-21", highlight: "гарантия лучшей цены не сработала" },
    ],
    risks: [
      "Может быть нормальная политика разных каналов, а не ошибка",
      "Нужна проверка правил промо и синхронизации ценников",
    ],
    ownerTeam: "Marketing",
    recommendedAction: "Передать маркетингу и retail IT",
    taskDescription: "Проверить синхронизацию промо-цен между сайтом, POS и терминалами в зале",
  },
  {
    id: "i-12",
    title: "Поддержка теряет контекст между магазином, сервисом и приложением",
    description:
      "36 отзывов описывают петлю: клиент уже объяснил проблему, но следующий канал снова просит начать сначала.",
    topicId: "support",
    subtopicId: "support_context_loss",
    status: "in_progress",
    impact: "down_repeat",
    confidence: 84,
    signal: 88,
    expectedEffect: "−18…26% повторных обращений",
    priority: "high",
    owner: { name: "Иван Н.", team: "Customer Care" },
    createdAt: dayOffsetISO(7),
    reviewIds: ["r-5", "r-12", "r-18"],
    confidenceBreakdown: cb(36, [
      { label: "Объём отзывов", score: 24, description: "36 отзывов за 30 дней" },
      {
        label: "Повторяемость",
        score: 22,
        description: "Одинаковая петля между магазином, сервисом и чатом",
      },
      { label: "Тональность", score: 18, description: "87% негативные" },
      {
        label: "Разные источники",
        score: 12,
        description: "Яндекс Reviews, 2GIS, App Store, Otzovik",
      },
      { label: "Свежесть", score: 8, description: "Рост на 19%" },
    ]),
    expectedEffectV2: {
      type: "repeat_reduction",
      range: { min: 18, max: 26 },
      unit: "%",
      label: "средний-высокий",
      reason: "Повторные обращения вызваны не новой проблемой, а потерей контекста между каналами",
    },
    generationReason: [
      "36 отзывов с жалобой на перевод между каналами",
      "В 58% отзывов упоминается, что клиент уже оставлял обращение",
      "Петля чаще всего появляется в гарантийных и доставочных кейсах",
    ],
    evidenceReviews: [
      { reviewId: "r-5", highlight: "поддержка видит обращение, но не может сказать статус" },
      { reviewId: "r-12", highlight: "претензию потеряли, статуса нет" },
      { reviewId: "r-18", highlight: "горячая линия оставила обращение и предложила ждать неделю" },
    ],
    risks: [
      "Причина может быть не в интерфейсе поддержки, а в разрыве прав доступа между системами",
      "Нужна карта статусов обращения во всех каналах",
    ],
    ownerTeam: "Customer Care",
    recommendedAction: "Передать Customer Care и владельцам CRM",
    taskDescription:
      "Собрать единый статус обращения по заказу и показать его в чате, магазине и сервисном центре",
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
  {
    id: "a1",
    topicId: "delay",
    spike: 142,
    description: "Резкий рост жалоб на сроки доставки за 7 дней",
    date: dayOffsetISO(2),
  },
  {
    id: "a2",
    topicId: "payment",
    spike: 88,
    description: "Всплеск проблем с оплатой картой Мир",
    date: dayOffsetISO(5),
  },
  {
    id: "a3",
    topicId: "positive",
    spike: 34,
    description: "Положительные упоминания программы лояльности +34%",
    date: dayOffsetISO(1),
  },
  {
    id: "a4",
    topicId: "fake",
    spike: 67,
    description: "Новый кластер: серые поставки в категории Аудио",
    date: dayOffsetISO(4),
  },
  {
    id: "a5",
    topicId: "fraud",
    spike: 109,
    description: "Рост жалоб на допуслуги в чеке после оформления рассрочки",
    date: dayOffsetISO(3),
  },
  {
    id: "a6",
    topicId: "support",
    spike: 76,
    description: "Повторные обращения из-за потери контекста между каналами",
    date: dayOffsetISO(6),
  },
];

// Topic distribution
export const TOPIC_DISTRIBUTION = TOPICS.map((t) => {
  const reviews = REVIEWS.filter((r) => r.topics.includes(t.id));
  const pos = reviews.filter((r) => r.sentiment === "positive").length;
  const neg = reviews.filter((r) => r.sentiment === "negative").length;
  const mix = reviews.filter((r) => r.sentiment === "mixed").length;
  return { ...t, total: reviews.length, positive: pos, negative: neg, mixed: mix };
})
  .filter((t) => t.total > 0)
  .sort((a, b) => b.total - a.total);

export function getTopic(id: string) {
  return TOPICS.find((t) => t.id === id);
}

export function getReview(id: string) {
  return REVIEWS.find((r) => r.id === id);
}

// Подтверждённость проблем + альтернативные гипотезы (P0 — фидбек Yasya)
const PROBLEM_CONFIDENCE: Record<string, ProblemConfidence> = {
  "i-1": {
    level: "high",
    reviewsCount: 38,
    description: "76% жалоб содержат одинаковую формулировку «витринный» в 3 разных источниках",
  },
  "i-2": {
    level: "high",
    reviewsCount: 42,
    description: "67% жалоб — повторный перенос 3+ раз, рост на 23% за 2 недели",
  },
  "i-3": {
    level: "high",
    reviewsCount: 76,
    description: "Устойчивая позитивная лексика «реальные бонусы» в нескольких каналах",
  },
  "i-4": {
    level: "high",
    reviewsCount: 34,
    description: "В 72% жалоб одинаковый сценарий «обещают перезвонить — не перезванивают»",
  },
  "i-5": {
    level: "medium",
    reviewsCount: 9,
    description: "Кластер маленький, но сценарий идентичный — нужны логи шлюза",
  },
  "i-6": {
    level: "high",
    reviewsCount: 28,
    description: "Корреляция фразы «распаковали при мне» с оценкой 5★ — 0.74",
  },
  "i-7": {
    level: "medium",
    reviewsCount: 9,
    description: "Сигнал критичный, но требует подтверждения данными от поставщиков",
  },
  "i-8": {
    level: "low",
    reviewsCount: 4,
    description: "Кластер слишком маленький — статистически слабый сигнал",
  },
  "i-9": {
    level: "high",
    reviewsCount: 31,
    description:
      "69% жалоб описывают допуслугу, обнаруженную уже после оплаты или оформления рассрочки",
  },
  "i-10": {
    level: "high",
    reviewsCount: 28,
    description:
      "64% отзывов упоминают цепочку приложение → бот → магазин → оператор без владельца вопроса",
  },
  "i-11": {
    level: "medium",
    reviewsCount: 24,
    description:
      "Повторы есть в разных каналах, но нужно отделить политику промо от ошибки синхронизации",
  },
  "i-12": {
    level: "high",
    reviewsCount: 36,
    description:
      "58% отзывов говорят, что обращение уже было создано, но следующий канал начинает заново",
  },
};

const INSIGHT_ALTERNATIVES: Record<string, CauseHypothesis[]> = {
  "i-1": [
    {
      id: "i-1-a",
      statement:
        "Возможно, на складе нет явной маркировки витринных образцов — товар попадает в отгрузку как новый",
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
      supportingReviewIds: ["r-3", "r-30"],
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
      supportingReviewIds: ["r-30"],
    },
    {
      id: "i-1-c",
      statement:
        "Возможно, в учётной системе нет явного статуса «витринный» — поэтому информация теряется на пути склад → магазин",
      solutionConfidence: 47,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Проверить структуру справочника товаров — есть ли поле «состояние»",
        "Посмотреть, как этот атрибут передаётся в чек / накладную",
        "Сверить с командой IT, какие справочники синхронизируются",
      ],
      missingData: ["Схема товарного справочника", "Логи интеграции WMS ↔ POS"],
      nextActions: [
        "Запросить у IT схему товарного справочника",
        "Согласовать пилот: добавить флаг «витринный» в карточку",
      ],
      supportingReviewIds: ["r-30"],
    },
    {
      id: "i-1-d",
      statement:
        "Возможно, часть жалоб — на повреждённую упаковку при доставке, и клиент трактует это как «витринный»",
      solutionConfidence: 38,
      confidenceLabel: "низкая",
      whatToCheck: [
        "Разделить жалобы по формулировкам: «витрина» vs «упаковка»",
        "Сверить с логами доставки — были ли инциденты по этим заказам",
      ],
      missingData: ["Фотофиксация при выдаче курьером", "Лог инцидентов last-mile"],
      nextActions: ["Уточнить у клиентов, как именно выглядел товар при получении"],
      supportingReviewIds: ["r-1"],
    },
  ],
  "i-2": [
    {
      id: "i-2-a",
      statement:
        "Возможно, слоты выходного дня переполняются, и заказы автоматически переносятся системой",
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
      supportingReviewIds: ["r-2", "r-19"],
    },
    {
      id: "i-2-b",
      statement:
        "Возможно, у подрядчика доставки не хватает курьеров на выходные — и переносы идут со стороны курьерской службы",
      solutionConfidence: 55,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Запросить у подрядчика отчёт по доступности курьеров по дням",
        "Сравнить долю отказов курьеров в выходные vs будни",
      ],
      missingData: ["Отчёт по доступности курьеров", "Логи отказов на стороне подрядчика"],
      nextActions: ["Связаться с менеджером подрядчика", "Проверить, есть ли SLA по выходным"],
      supportingReviewIds: ["r-1", "r-18"],
    },
    {
      id: "i-2-c",
      statement:
        "Возможно, проблема связана с пиком предпраздничных заказов, а не с системной нехваткой",
      solutionConfidence: 32,
      confidenceLabel: "низкая",
      whatToCheck: [
        "Сравнить долю переносов в предпраздничные недели vs обычные",
        "Сверить с календарём акций и распродаж",
      ],
      missingData: ["Календарь маркетинговых активностей"],
      nextActions: ["Запросить у маркетинга календарь акций"],
      supportingReviewIds: [],
    },
  ],
  "i-4": [
    {
      id: "i-4-a",
      statement:
        "Возможно, в Customer Care нет настроенного автоэскалейта при просрочке SLA — обращения «зависают»",
      solutionConfidence: 71,
      confidenceLabel: "высокая",
      whatToCheck: [
        "Проверить настройки SLA в Helpdesk",
        "Посмотреть, на какой стадии «зависают» 13 кейсов из жалоб",
        "Сверить, есть ли уведомление руководителю при просрочке",
      ],
      missingData: ["Логи Helpdesk по 13 жалобам", "Карта эскалаций"],
      nextActions: ["Запросить у Customer Care настройки SLA", "Согласовать пилот автоэскалейта"],
      supportingReviewIds: ["r-5", "r-12", "r-22"],
    },
    {
      id: "i-4-b",
      statement:
        "Возможно, сотрудники физически не успевают обработать поток обращений — нужна оценка нагрузки",
      solutionConfidence: 49,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Запросить отчёт по нагрузке на одного оператора",
        "Сравнить количество обращений с числом сотрудников по сменам",
      ],
      missingData: ["Workforce-метрики Customer Care"],
      nextActions: ["Запросить у HR и операционки данные по нагрузке"],
      supportingReviewIds: ["r-5"],
    },
    {
      id: "i-4-c",
      statement:
        "Возможно, гарантийные случаи требуют согласования с производителем, и задержка идёт оттуда",
      solutionConfidence: 36,
      confidenceLabel: "низкая",
      whatToCheck: [
        "Проверить, по каким брендам случаются просрочки",
        "Сверить SLA с производителями",
      ],
      missingData: ["SLA производителей по гарантии"],
      nextActions: ["Запросить у юристов договоры с топ-5 поставщиками"],
      supportingReviewIds: [],
    },
  ],
  "i-5": [
    {
      id: "i-5-a",
      statement:
        "Возможно, в мобильной оплате через App Store при таймауте идёт двойной запрос к шлюзу",
      solutionConfidence: 58,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Запросить логи шлюза по 9 жалобам",
        "Сверить timestamps двойных списаний",
        "Проверить логику ретрая в мобильном клиенте",
      ],
      missingData: ["Логи платёжного шлюза", "Конфиг ретраев в App Store-сборке"],
      nextActions: ["Запросить у Payments выгрузку логов за 30 дней"],
      supportingReviewIds: ["r-14"],
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
  "i-9": [
    {
      id: "i-9-a",
      statement:
        "Возможно, в сценарии рассрочки допуслуги отмечаются пакетно и клиент не видит отдельное согласие на каждую позицию",
      solutionConfidence: 66,
      confidenceLabel: "высокая",
      whatToCheck: [
        "Посмотреть экран/документы оформления рассрочки",
        "Сверить, где клиент подтверждает каждую допуслугу",
        "Проверить чеки из жалоб на одинаковые SKU услуг",
      ],
      missingData: [
        "Чеки и договоры по 10 жалобам",
        "Скриншоты текущего сценария рассрочки",
        "Список SKU допуслуг и каналов продаж",
      ],
      nextActions: [
        "Запросить выборку чеков по жалобам",
        "Провести юридический review текста согласия",
        "Запустить пилот отдельного чекбокса для каждой услуги",
      ],
      supportingReviewIds: ["r-4", "r-25"],
    },
    {
      id: "i-9-b",
      statement:
        "Возможно, продавцы объясняют допуслугу как обязательное условие одобрения покупки",
      solutionConfidence: 52,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Проверить скрипты продаж по рассрочке",
        "Сравнить долю жалоб по магазинам и сменам",
        "Провести выборочный mystery-shopping",
      ],
      missingData: ["Скрипты продавцов", "Смена/магазин из жалоб"],
      nextActions: ["Согласовать контрольный звонок или mystery-shopping"],
      supportingReviewIds: ["r-25"],
    },
  ],
  "i-10": [
    {
      id: "i-10-a",
      statement:
        "Возможно, после оплаты заказ блокируется в OMS и self-service перенос доставки недоступен без оператора",
      solutionConfidence: 63,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Проверить статусы заказа, при которых блокируется перенос",
        "Сравнить правила OMS с тем, что показывает приложение",
        "Посмотреть логи кликов по кнопке переноса доставки",
      ],
      missingData: [
        "Логи OMS по изменению слота",
        "События мобильного приложения",
        "Правила подрядчика по cutoff времени",
      ],
      nextActions: [
        "Запросить у мобильной команды события reschedule",
        "Собрать матрицу статусов, где перенос возможен",
        "Описать UX для альтернативных доступных слотов",
      ],
      supportingReviewIds: ["r-19", "r-2"],
    },
    {
      id: "i-10-b",
      statement:
        "Возможно, канал поддержки не видит доступные слоты подрядчика и поэтому отправляет клиента в магазин",
      solutionConfidence: 46,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Сравнить права оператора и магазина на изменение доставки",
        "Проверить, какие поля видны в helpdesk",
      ],
      missingData: ["Матрица прав Helpdesk / магазин / логистика"],
      nextActions: ["Провести воркшоп с Logistics и Customer Care"],
      supportingReviewIds: ["r-2", "r-18"],
    },
  ],
  "i-11": [
    {
      id: "i-11-a",
      statement:
        "Возможно, промо-цены синхронизируются в POS и терминалы зала с задержкой относительно сайта",
      solutionConfidence: 57,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Проверить timestamp обновления цены в сайте, POS и терминале",
        "Сверить проблемные SKU с календарём промо",
        "Посмотреть, возникает ли проблема в первые часы акции",
      ],
      missingData: ["Логи синхронизации цен", "Список SKU из жалоб", "Календарь промо"],
      nextActions: ["Запросить у retail IT логи синхронизации цен"],
      supportingReviewIds: ["r-10", "r-21"],
    },
    {
      id: "i-11-b",
      statement:
        "Возможно, клиент не видит различие между онлайн-ценой, ценой магазина и ценой самовывоза",
      solutionConfidence: 44,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Проверить, как в карточке товара объясняется цена канала",
        "Сравнить тексты промо в email, сайте и магазине",
      ],
      missingData: ["Тексты промо и правила каналов"],
      nextActions: ["Подготовить вариант явной подсказки рядом с ценой"],
      supportingReviewIds: ["r-10"],
    },
  ],
  "i-12": [
    {
      id: "i-12-a",
      statement:
        "Возможно, магазин, сервисный центр и чат используют разные системы обращений без единого статуса по заказу",
      solutionConfidence: 69,
      confidenceLabel: "высокая",
      whatToCheck: [
        "Построить путь обращения по 10 жалобам",
        "Проверить, какие статусы доступны каждому каналу",
        "Сверить, есть ли единый ID обращения в заказе",
      ],
      missingData: ["CRM-id обращений", "Helpdesk-логи", "Статусы сервисного центра"],
      nextActions: [
        "Собрать карту систем поддержки",
        "Выбрать единый публичный статус для клиента",
        "Запустить пилот отображения статуса в чате",
      ],
      supportingReviewIds: ["r-5", "r-12", "r-18"],
    },
    {
      id: "i-12-b",
      statement:
        "Возможно, операторы видят обращение, но не имеют права менять статус или давать срок",
      solutionConfidence: 48,
      confidenceLabel: "средняя",
      whatToCheck: [
        "Проверить права операторов по гарантийным и доставочным кейсам",
        "Сверить, какие причины закрытия доступны в интерфейсе",
      ],
      missingData: ["Матрица прав операторов", "Список статусных переходов"],
      nextActions: ["Запросить у Customer Care матрицу прав и SLA"],
      supportingReviewIds: ["r-5"],
    },
  ],
};

// Hypothesis statements + next steps + validation plans (kept separately to avoid touching every insight inline)
const INSIGHT_EXTRAS: Record<
  string,
  { hypothesisStatement: HypothesisStatement; nextSteps: string[]; validationPlan: ValidationPlan }
> = {
  "i-1": {
    hypothesisStatement: {
      ifPart:
        "ввести обязательную фотофиксацию состояния товара перед отгрузкой и явную маркировку витринных образцов",
      thenPart: "снизится количество жалоб на витринный товар, проданный как новый",
      becausePart:
        "76% жалоб содержат одинаковую формулировку про «витринный» — клиенты не получают предупреждения о состоянии товара",
    },
    nextSteps: [
      "Согласовать с командой склада регламент фотофиксации",
      "Подготовить шаблон карточки товара с пометкой «витринный»",
      "Запустить пилот в 5 точках Москвы и СПб",
      "Через 4 недели сравнить долю жалоб с базовым периодом",
    ],
    validationPlan: {
      format: "Пилот в 5 магазинах",
      duration: "4 недели",
      metric: "−15% жалоб на витринный товар",
      teams: ["Склад", "Контроль качества", "Розница"],
    },
  },
  "i-2": {
    hypothesisStatement: {
      ifPart: "расширить число слотов доставки в выходные и предпраздничные дни",
      thenPart: "снизится число повторных жалоб на перенос сроков",
      becausePart:
        "67% переносов случается в выходные — слоты переполняются и заказы автоматически переносятся",
    },
    nextSteps: [
      "Сверить данные о фактической загрузке слотов с командой логистики",
      "Договориться с подрядчиком о доп. курьерах в пятницу–субботу",
      "Запустить расширенные слоты в одном городе",
      "Через 2 недели сравнить долю повторных переносов",
    ],
    validationPlan: {
      format: "Пилот в одном городе",
      duration: "2 недели",
      metric: "−25% повторных переносов",
      teams: ["Логистика", "Подрядчик доставки"],
    },
  },
  "i-3": {
    hypothesisStatement: {
      ifPart: "добавить упоминание «реальных бонусов» в email-рассылки и шаги оформления заказа",
      thenPart: "вырастет доля положительных упоминаний программы лояльности",
      becausePart:
        "клиенты уже хвалят программу — усиление коммуникации укрепляет существующий положительный сигнал",
    },
    nextSteps: [
      "Согласовать формулировки с маркетингом и юристами",
      "Подготовить A/B-тест email-рассылки",
      "Замерить рост NPS в когорте через 6 недель",
    ],
    validationPlan: {
      format: "A/B-тест email + чекаут",
      duration: "6 недель",
      metric: "+10% NPS в когорте",
      teams: ["Маркетинг", "CRM"],
    },
  },
  "i-4": {
    hypothesisStatement: {
      ifPart:
        "ввести SLA 48 часов на первый ответ по гарантии и автоматический эскалейт при просрочке",
      thenPart: "снизится количество негативных отзывов про гарантию",
      becausePart:
        "72% жалоб повторяют сценарий «обещают перезвонить — не перезванивают» при среднем времени ответа 9 дней",
    },
    nextSteps: [
      "Включить SLA 48ч в скрипты Customer Care",
      "Настроить автоэскалейт в Helpdesk при просрочке",
      "Через 4 недели сравнить долю жалоб про гарантию",
    ],
    validationPlan: {
      format: "Изменение SLA в одной команде",
      duration: "4 недели",
      metric: "−20% жалоб на гарантию",
      teams: ["Клиентский сервис", "QA"],
    },
  },
  "i-5": {
    hypothesisStatement: {
      ifPart: "проанализировать логи платёжного шлюза и устранить причину двойных списаний",
      thenPart: "снизится количество жалоб на оплату и долгий возврат",
      becausePart:
        "9 жалоб с одинаковым сценарием за 14 дней — нужны данные шлюза, чтобы подтвердить причину",
    },
    nextSteps: [
      "Запросить логи платёжного шлюза за 30 дней",
      "Сопоставить логи с конкретными жалобами",
      "Сформулировать конкретную техническую гипотезу",
      "Заложить пилотный фикс в спринт",
    ],
    validationPlan: {
      format: "Технический аудит шлюза",
      duration: "1 неделя",
      metric: "Подтверждена/опровергнута причина двойных списаний",
      teams: ["Платежи", "Backend"],
    },
  },
  "i-6": {
    hypothesisStatement: {
      ifPart:
        "стандартизировать практику «распаковка при клиенте» как обязательный пункт чек-листа курьера",
      thenPart: "вырастет средняя оценка last-mile",
      becausePart: "в кластере отзывов фраза «распаковали при мне» коррелирует с оценкой 5★ (0.74)",
    },
    nextSteps: [
      "Обновить инструкцию last-mile",
      "Обучить курьеров на пилоте",
      "Через 4 недели сравнить средний рейтинг",
    ],
    validationPlan: {
      format: "Пилот с 50 курьерами",
      duration: "4 недели",
      metric: "+0.3★ к средней оценке",
      teams: ["Last Mile"],
    },
  },
  "i-7": {
    hypothesisStatement: {
      ifPart: "включить проверку серийных номеров через API производителя на категории Аудио",
      thenPart: "снизится число жалоб «серийник не пробивается» и риск серого канала",
      becausePart:
        "9 одинаковых жалоб за 30 дней с концентрацией в одной категории — высокий риск, но мало данных",
    },
    nextSteps: [
      "Запросить у поставщиков долю возвратов по серийнику",
      "Подключить API проверки от 2 ключевых производителей",
      "Запустить выборочную проверку 100 SKU",
    ],
    validationPlan: {
      format: "Проверка серийников через API",
      duration: "3 недели",
      metric: "Подтверждена/опровергнута гипотеза серого канала",
      teams: ["QA", "Закупки"],
    },
  },
  "i-8": {
    hypothesisStatement: {
      ifPart: "добавить дополнительного сотрудника на самовывоз с 18:00 до 20:00",
      thenPart: "снизится время ожидания и вырастет удовлетворённость самовывозом",
      becausePart: "4 отзыва о часовых очередях концентрируются в вечерний пик в одной точке",
    },
    nextSteps: ["Согласовать график с управляющим точкой", "Замерить очередь до и после"],
    validationPlan: {
      format: "Эксперимент в одной точке",
      duration: "2 недели",
      metric: "−30% времени ожидания",
      teams: ["Розница"],
    },
  },
  "i-9": {
    hypothesisStatement: {
      ifPart: "разделить согласие на каждую допуслугу и показать итоговый чек до оплаты",
      thenPart:
        "снизится количество жалоб на навязанные подписки, страховки и расширенную гарантию",
      becausePart: "клиенты обнаруживают спорные услуги уже после оплаты, особенно в рассрочке",
    },
    nextSteps: [
      "Собрать чеки и договоры по 10 жалобам",
      "Проверить юридическую формулировку согласия",
      "Запустить экран предпросмотра чека перед оплатой",
      "Сравнить долю жалоб через 4 недели",
    ],
    validationPlan: {
      format: "A/B-тест сценария оформления",
      duration: "4 недели",
      metric: "−20% жалоб на допуслуги",
      teams: ["Retail Ops", "Legal", "Checkout"],
    },
  },
  "i-10": {
    hypothesisStatement: {
      ifPart: "дать клиенту self-service перенос доставки после оплаты в пределах доступных слотов",
      thenPart: "уменьшится число повторных обращений в чат, магазин и горячую линию",
      becausePart:
        "текущий путь заставляет клиента ходить по кругу между приложением, ботом и магазином",
    },
    nextSteps: [
      "Собрать матрицу статусов заказа, где перенос технически возможен",
      "Проверить SLA подрядчиков по cutoff времени",
      "Спроектировать UX выбора нового слота",
      "Запустить пилот в одном городе",
    ],
    validationPlan: {
      format: "Self-service пилот",
      duration: "3 недели",
      metric: "−25% повторных контактов по доставке",
      teams: ["Logistics", "Mobile", "Customer Care"],
    },
  },
  "i-11": {
    hypothesisStatement: {
      ifPart:
        "синхронизировать промо-цены между сайтом, POS и терминалами зала и явно маркировать цену канала",
      thenPart: "вырастет доверие к акциям и снизится число смешанных отзывов о покупке",
      becausePart: "клиенты видят три разные цены и вынуждены доказывать актуальную",
    },
    nextSteps: [
      "Проверить timestamp обновления цены в трёх системах",
      "Выделить SKU с максимальным числом жалоб",
      "Подготовить подсказку «цена действует при онлайн-оформлении»",
      "Сравнить обращения по цене до/после",
    ],
    validationPlan: {
      format: "Пилот на промо-категории",
      duration: "2 недели",
      metric: "−15% обращений по расхождению цены",
      teams: ["Marketing", "Retail IT"],
    },
  },
  "i-12": {
    hypothesisStatement: {
      ifPart:
        "собрать единый публичный статус обращения по заказу для чата, магазина и сервисного центра",
      thenPart: "снизится количество повторных обращений и жалоб на потерю контекста",
      becausePart: "клиент уже оставлял обращение, но следующий канал начинает сценарий заново",
    },
    nextSteps: [
      "Построить карту статусов обращения во всех системах",
      "Выбрать единый ID обращения, видимый клиенту",
      "Добавить статус в чат и карточку заказа",
      "Через 4 недели сравнить долю повторных контактов",
    ],
    validationPlan: {
      format: "Пилот единого статуса",
      duration: "4 недели",
      metric: "−22% повторных обращений",
      teams: ["Customer Care", "CRM", "Service"],
    },
  },
};

export function getInsight(id: string): Insight | undefined {
  const i = INSIGHTS.find((i) => i.id === id);
  if (!i) return undefined;
  const extras = INSIGHT_EXTRAS[id];
  return {
    ...i,
    ...(extras ?? {}),
    problemConfidence: PROBLEM_CONFIDENCE[id],
    alternatives: INSIGHT_ALTERNATIVES[id],
  };
}

export const KPI = {
  totalReviews: REVIEWS.length * 28, // simulate scale
  totalReviewsDelta: 12.4,
  sentimentIndex: Math.round(
    ((REVIEWS.filter((r) => r.sentiment === "positive").length -
      REVIEWS.filter((r) => r.sentiment === "negative").length) /
      REVIEWS.length) *
      100,
  ),
  sentimentDelta: 8,
  insights: INSIGHTS.length * 9,
  insightsDelta: 22,
  strongInsightsInWork:
    INSIGHTS.filter((i) => i.status === "in_progress" && i.signal > 70).length * 3,
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
