import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  KPI, TIMESERIES, TOPIC_DISTRIBUTION, REVIEWS, INSIGHTS, ANOMALIES, IMPACT_CASES, getTopic, getInsight,
} from "@/lib/mock/data";
import { SectionHeader, AiBadge, StatusBadge, Delta, TopicChip } from "@/components/atoms";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis, ReferenceLine, Cell, Line, LineChart,
} from "recharts";
import {
  Sparkles, ArrowRight, AlertTriangle, Repeat, TrendingUp, MessageSquare,
  ChevronRight, CheckCircle2, ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Voicelens Review Intelligence" },
      { name: "description", content: "AI-аналитика клиентских отзывов: тональность, темы, инсайты и эффект изменений." },
    ],
  }),
  component: DashboardPage,
});

const chartTooltip = {
  contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11, padding: 8, boxShadow: "var(--shadow-elev-2)" },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 10, marginBottom: 4 },
  cursor: { stroke: "var(--border)", strokeDasharray: "3 3" },
};

// ──────────────────────────────────────────────────────────────────────────
// Hero: AI brief

function AiBrief() {
  const headline = INSIGHTS.find(i => i.id === "i-2")!;
  return (
    <Card className="relative overflow-hidden border-ai/20 bg-gradient-to-br from-ai-soft/40 via-card to-card p-5 shadow-[var(--shadow-elev-2)]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-ai/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-2.5">
          <div className="flex items-center gap-2">
            <AiBadge />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Утренний brief · 30 дней</span>
          </div>
          <h2 className="text-xl font-semibold leading-snug tracking-tight md:text-2xl">
            За 30 дней негатив по доставке вырос на <span className="text-negative">+42%</span>,
            готовы <span className="text-ai">3 новые гипотезы</span> к работе.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Главное событие — кластер задержек по выходным (<b>17 повторных жалоб</b>, signal 79).
            Сильные стороны бренда устойчиво растут: <b>+34%</b> упоминаний программы лояльности.
            Рекомендуем начать с гипотезы по логистике — потенциальный эффект <b>−25%</b> повторов.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 lg:items-end">
          <Button asChild size="sm" className="h-9">
            <Link to="/insights/$insightId" params={{ insightId: headline.id }}>
              Открыть главную гипотезу <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
            <Link to="/insights">Все гипотезы ({INSIGHTS.length})</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Compact KPI strip

function HealthStrip() {
  const items = [
    { label: "Sentiment Index", value: KPI.sentimentIndex, suffix: "/100", delta: KPI.sentimentDelta, tone: KPI.sentimentIndex >= 0 ? "positive" : "negative" },
    { label: "Insight → Action", value: KPI.conversion, suffix: "%", delta: KPI.conversionDelta, tone: "ai" },
    { label: "Сильных в работе", value: KPI.strongInsightsInWork, suffix: "", delta: 4, tone: "neutral" },
    { label: "Δ Sentiment после внедрений", value: `+${KPI.sentimentAfter}`, suffix: "", delta: 6, tone: "positive" },
  ] as const;
  return (
    <Card className="grid grid-cols-2 divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col gap-1 p-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{it.label}</span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="display num text-2xl font-semibold tracking-tight">
              {it.value}
              {it.suffix && <span className="ml-0.5 text-sm font-medium text-muted-foreground">{it.suffix}</span>}
            </span>
            <Delta value={it.delta} />
          </div>
        </div>
      ))}
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Attention feed — приоритизированные сигналы

type AttentionItem = {
  id: string;
  severity: "critical" | "high" | "medium";
  kind: "anomaly" | "repeat" | "insight" | "growth";
  title: string;
  reason: string;
  metric: string;
  insightId?: string;
  topicId?: string;
  reviewCount: number;
};

const ATTENTION: AttentionItem[] = [
  {
    id: "att-1", severity: "critical", kind: "anomaly",
    title: "Резкий рост жалоб на сроки доставки",
    reason: "AI заметил всплеск +142% за 7 дней. Связан с гипотезой о слотах выходного дня.",
    metric: "+142%", insightId: "i-2", topicId: "delay", reviewCount: 17,
  },
  {
    id: "att-2", severity: "critical", kind: "insight",
    title: "Витринный товар продаётся как новый",
    reason: "14 повторов за 30 дней, концентрация в Москве и СПб. Гипотеза валидирована.",
    metric: "signal 88", insightId: "i-1", topicId: "defective", reviewCount: 14,
  },
  {
    id: "att-3", severity: "high", kind: "repeat",
    title: "Гарантия: SLA нарушен в 38% обращений",
    reason: "Однотипный сценарий «обещают перезвонить — не перезванивают». Среднее 9 дней.",
    metric: "13 повторов", insightId: "i-4", topicId: "warranty", reviewCount: 13,
  },
  {
    id: "att-4", severity: "medium", kind: "growth",
    title: "Программа лояльности — главный driver позитива",
    reason: "76 упоминаний с 5★. Возможность конвертировать в NPS-кампанию.",
    metric: "+34%", insightId: "i-3", topicId: "loyalty-bonus", reviewCount: 76,
  },
  {
    id: "att-5", severity: "high", kind: "anomaly",
    title: "Подозрение на серый канал в категории Аудио",
    reason: "Новый кластер «серийник не пробивается» — 9 отзывов, конфиденс 71%.",
    metric: "новый кластер", insightId: "i-7", topicId: "fake", reviewCount: 9,
  },
];

function AttentionCard({ item }: { item: AttentionItem }) {
  const [open, setOpen] = useState(false);
  const Icon = item.kind === "anomaly" ? AlertTriangle : item.kind === "repeat" ? Repeat : item.kind === "growth" ? TrendingUp : Sparkles;
  const sevTone = item.severity === "critical"
    ? "border-l-negative bg-negative-soft/20"
    : item.severity === "high"
      ? "border-l-mixed bg-mixed-soft/15"
      : "border-l-ai bg-ai-soft/15";
  const iconCls = item.severity === "critical" ? "text-negative" : item.severity === "high" ? "text-mixed" : "text-ai";

  const TitleWrap: React.ElementType = item.insightId ? Link : "div";
  const titleProps = item.insightId
    ? { to: "/insights/$insightId", params: { insightId: item.insightId }, className: "block min-w-0 flex-1 space-y-1 hover:[&_h4]:text-ai" }
    : { className: "block min-w-0 flex-1 space-y-1" };

  return (
    <div className={cn("group rounded-lg border border-l-[3px] bg-card transition hover:shadow-[var(--shadow-elev-1)]", sevTone)}>
      <div className="flex w-full items-start gap-3 p-3.5 text-left">
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconCls)} />
        <TitleWrap {...titleProps}>
          <div className="flex items-center justify-between gap-3">
            <h4 className="truncate text-sm font-medium transition-colors">{item.title}</h4>
            <span className="num shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground">{item.metric}</span>
          </div>
          <p className="line-clamp-1 text-[11.5px] leading-relaxed text-muted-foreground">{item.reason}</p>
          <div className="flex items-center gap-3 pt-0.5 text-[10.5px] text-muted-foreground">
            {item.topicId && <TopicChip name={getTopic(item.topicId)?.name ?? ""} kind={getTopic(item.topicId)?.kind} />}
            <span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" />{item.reviewCount} отзывов</span>
          </div>
        </TitleWrap>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Свернуть" : "Развернуть действия"}
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="flex flex-wrap items-center gap-2 border-t bg-background/40 px-3.5 py-2.5">
          {item.insightId && (
            <Button asChild size="sm" variant="default" className="h-7 text-[11px]">
              <Link to="/insights/$insightId" params={{ insightId: item.insightId }}>
                Открыть гипотезу <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          )}
          <Button asChild size="sm" variant="outline" className="h-7 text-[11px]">
            <Link to="/reviews">Посмотреть отзывы ({item.reviewCount})</Link>
          </Button>
          {item.topicId && (
            <Button asChild size="sm" variant="ghost" className="h-7 text-[11px]">
              <Link to="/topics/$topicId" params={{ topicId: item.topicId }}>Тема</Link>
            </Button>
          )}
          <span className="ml-auto text-[10px] text-muted-foreground">Замечено AI · {new Date().toLocaleDateString("ru-RU")}</span>
        </div>
      )}
    </div>
  );
}

function AttentionFeed() {
  return (
    <Card className="p-4">
      <SectionHeader
        title="Требует вашего внимания"
        subtitle="Приоритизированные сигналы AI · 5 пунктов"
        action={<Button asChild variant="ghost" size="sm" className="h-7 text-xs"><Link to="/insights">Все гипотезы <ChevronRight className="ml-0.5 h-3 w-3" /></Link></Button>}
      />
      <div className="space-y-2">
        {ATTENTION.map(it => <AttentionCard key={it.id} item={it} />)}
      </div>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Charts: sentiment trend + diverging topics

function TrendChart() {
  return (
    <Card className="p-4">
      <SectionHeader title="Динамика тональности" subtitle="Объём по тональности · 90 дней" />
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TIMESERIES}>
            <defs>
              <linearGradient id="g-pos" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--positive)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--positive)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="g-neg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--negative)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--negative)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} interval={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
            <RTooltip {...chartTooltip} />
            <Area type="monotone" dataKey="positive" stackId="1" stroke="var(--positive)" strokeWidth={1.5} fill="url(#g-pos)" />
            <Area type="monotone" dataKey="negative" stackId="1" stroke="var(--negative)" strokeWidth={1.5} fill="url(#g-neg)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function DivergingChart() {
  const data = TOPIC_DISTRIBUTION.slice(0, 7).map(t => ({
    name: t.name.length > 22 ? t.name.slice(0, 22) + "…" : t.name,
    pos: t.positive,
    neg: -t.negative,
    id: t.id,
  }));
  return (
    <Card className="p-4">
      <SectionHeader title="Вклад тем" subtitle="Слева негатив · справа позитив" />
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" stackOffset="sign" margin={{ left: 8 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={140} />
            <RTooltip {...chartTooltip} />
            <ReferenceLine x={0} stroke="var(--border)" />
            <Bar dataKey="neg" stackId="x" fill="var(--negative)" fillOpacity={0.85} radius={[4, 0, 0, 4]}>
              {data.map((_, i) => <Cell key={i} />)}
            </Bar>
            <Bar dataKey="pos" stackId="x" fill="var(--positive)" fillOpacity={0.85} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Impact section

function ImpactRow({ c }: { c: typeof IMPACT_CASES[number] }) {
  const insight = getInsight(c.insightId);
  const dSent = c.after.sentiment - c.before.sentiment;
  const dRating = +(c.after.rating - c.before.rating).toFixed(1);
  const dCompl = Math.round(((c.after.complaints - c.before.complaints) / c.before.complaints) * 100);
  const trend = [c.before, ...Array.from({ length: 5 }).map((_, i) => ({
    sentiment: c.before.sentiment + ((c.after.sentiment - c.before.sentiment) * (i + 1)) / 5,
  })), c.after].map((p, i) => ({ i, v: p.sentiment }));

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3.5 md:flex-row md:items-center md:gap-5">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-positive" />
        <span className="rounded-md bg-positive-soft px-1.5 py-0.5 text-[10px] font-semibold text-positive-foreground">Implemented</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{c.action}</p>
        {insight && (
          <Link to="/insights/$insightId" params={{ insightId: insight.id }} className="text-[11px] text-muted-foreground hover:text-foreground">
            из гипотезы «{insight.title}» →
          </Link>
        )}
      </div>
      <div className="flex items-center gap-5 md:gap-6">
        <Metric label="Sentiment" value={`${c.after.sentiment > 0 ? "+" : ""}${c.after.sentiment}`} delta={dSent} />
        <Metric label="Рейтинг" value={c.after.rating.toFixed(1)} delta={Math.round(dRating * 100)} suffix="" />
        <Metric label="Жалобы" value={c.after.complaints.toString()} delta={dCompl} invert />
      </div>
      <div className="h-10 w-24 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend}>
            <Line dataKey="v" stroke="var(--positive)" strokeWidth={1.8} dot={false} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Metric({ label, value, delta, suffix = "%", invert }: { label: string; value: string; delta: number; suffix?: string; invert?: boolean }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="num text-sm font-semibold tabular-nums">{value}</span>
        <Delta value={delta} suffix={suffix} invert={invert} />
      </div>
    </div>
  );
}

function ImpactBlock() {
  return (
    <Card className="p-4">
      <SectionHeader
        title="Эффект внедрённых решений"
        subtitle="Метрики до и после · последние 30 дней"
        action={<Button asChild variant="ghost" size="sm" className="h-7 text-xs"><Link to="/impact">Подробно <ChevronRight className="ml-0.5 h-3 w-3" /></Link></Button>}
      />
      <div className="space-y-2">
        {IMPACT_CASES.map(c => <ImpactRow key={c.id} c={c} />)}
      </div>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Page

function DashboardPage() {
  const newCount = INSIGHTS.filter(i => i.status === "new").length;
  const repeatCount = REVIEWS.filter(r => r.repeatCount > 5).length;

  return (
    <AppShell
      title="Главный дашборд"
      subtitle={`AI заметил ${ANOMALIES.length} новых сигналов · ${newCount} новых гипотез · ${repeatCount} повторов`}
      actions={
        <Button asChild size="sm" className="h-8 text-xs">
          <Link to="/insights"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> Перейти к гипотезам</Link>
        </Button>
      }
    >
      <div className="space-y-5 p-4 md:p-6">
        <AiBrief />

        <HealthStrip />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AttentionFeed />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <TrendChart />
            <DivergingChart />
          </div>
        </div>

        <ImpactBlock />
      </div>
    </AppShell>
  );
}
