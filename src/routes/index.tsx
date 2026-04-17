import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { Card } from "@/components/ui/card";
import { KPI, TIMESERIES, TOPIC_DISTRIBUTION, REVIEWS, INSIGHTS, ANOMALIES, SOURCE_RATINGS, getTopic } from "@/lib/mock/data";
import { SectionHeader, SentimentPill, TopicChip, AiBadge } from "@/components/atoms";
import { InsightCard } from "@/components/insight-card";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis, ReferenceLine, Cell,
} from "recharts";
import { AlertTriangle, Repeat, TrendingUp, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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

function DashboardPage() {
  const recentInsights = INSIGHTS.filter(i => i.status !== "rejected").slice(0, 3);
  const repeats = REVIEWS.filter(r => r.repeatCount > 5).sort((a, b) => b.repeatCount - a.repeatCount).slice(0, 5);
  const sparkPos = TIMESERIES.slice(-30).map(d => d.positive);
  const sparkNeg = TIMESERIES.slice(-30).map(d => d.negative);
  const sparkSent = TIMESERIES.slice(-30).map(d => d.sentiment);

  // diverging contribution
  const contribution = TOPIC_DISTRIBUTION.slice(0, 8).map(t => ({
    name: t.name.length > 22 ? t.name.slice(0, 22) + "…" : t.name,
    pos: t.positive,
    neg: -t.negative,
    kind: t.kind,
  }));

  return (
    <AppShell
      title="Главный дашборд"
      subtitle="Аналитика отзывов · 30 дней · сравнение с предыдущим периодом"
      actions={<Button size="sm" className="h-8 text-xs"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI-резюме</Button>}
    >
      <div className="space-y-5 p-4 md:p-6">
        {/* KPI row 1 */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard label="Всего отзывов" value="1 792" delta={KPI.totalReviewsDelta} hint="Всего распарсенных отзывов за период" spark={sparkPos.map((p, i) => p + sparkNeg[i])} tone="ai" />
          <KpiCard label="Sentiment Index" value={KPI.sentimentIndex} suffix="/100" delta={KPI.sentimentDelta} hint="Индекс тональности от −100 до +100" spark={sparkSent} tone={KPI.sentimentIndex >= 0 ? "positive" : "negative"} />
          <KpiCard label="AI-инсайтов" value={KPI.insights} delta={KPI.insightsDelta} hint="Сгенерированных гипотез AI" tone="ai" spark={[5,8,12,9,14,18,22,28,31,38]} />
          <KpiCard label="Сильных в работе" value={KPI.strongInsightsInWork} delta={4} hint="Гипотезы с signal > 70 в статусе in_progress" tone="positive" />
        </div>

        {/* KPI row 2 */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard label="Insight → Action" value={KPI.conversion} suffix="%" delta={KPI.conversionDelta} hint="Доля инсайтов, переведённых в работу" tone="positive" />
          <KpiCard label="Доля повторных проблем" value={KPI.repeatRate} suffix="%" delta={KPI.repeatDelta} invertDelta hint="Чем меньше, тем лучше" tone="negative" />
          <KpiCard label="Δ Sentiment после внедрений" value={`+${KPI.sentimentAfter}`} delta={6} hint="Изменение индекса по темам с принятыми гипотезами" tone="positive" />
          <KpiCard label="Средняя оценка площадок" value={KPI.avgRating.toFixed(2)} delta={KPI.avgRatingDelta * 100 / 4} suffix="★" hint="Взвешенная средняя по 4 площадкам" tone="positive" />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="col-span-2 p-4">
            <SectionHeader title="Динамика отзывов" subtitle="Объём по тональности · 90 дней" />
            <div className="h-[260px]">
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
                    <linearGradient id="g-mix" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--mixed)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--mixed)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} interval={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <RTooltip {...chartTooltip} />
                  <Area type="monotone" dataKey="positive" stackId="1" stroke="var(--positive)" strokeWidth={1.5} fill="url(#g-pos)" />
                  <Area type="monotone" dataKey="mixed" stackId="1" stroke="var(--mixed)" strokeWidth={1.5} fill="url(#g-mix)" />
                  <Area type="monotone" dataKey="negative" stackId="1" stroke="var(--negative)" strokeWidth={1.5} fill="url(#g-neg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Sentiment Index" subtitle="Динамика индекса тональности" />
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TIMESERIES}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} interval={14} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} domain={[-100, 100]} />
                  <RTooltip {...chartTooltip} />
                  <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1} />
                  <Line dataKey="sentiment" type="monotone" stroke="var(--ai)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="p-4">
            <SectionHeader title="Распределение тем" subtitle="Top-10 по объёму" />
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOPIC_DISTRIBUTION.slice(0, 10).map(t => ({ name: t.name.length > 16 ? t.name.slice(0, 16) + "…" : t.name, total: t.total, kind: t.kind }))} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={120} />
                  <RTooltip {...chartTooltip} />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                    {TOPIC_DISTRIBUTION.slice(0, 10).map((t, i) => (
                      <Cell key={i} fill={t.kind === "strength" ? "var(--positive)" : t.kind === "opportunity" ? "var(--ai)" : "var(--negative)"} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="col-span-2 p-4">
            <SectionHeader title="Вклад тем в негатив и позитив" subtitle="Diverging — слева негатив, справа позитив" />
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contribution} layout="vertical" stackOffset="sign" margin={{ left: 8 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={150} />
                  <RTooltip {...chartTooltip} />
                  <ReferenceLine x={0} stroke="var(--border)" />
                  <Bar dataKey="neg" stackId="x" fill="var(--negative)" fillOpacity={0.85} radius={[4, 0, 0, 4]} />
                  <Bar dataKey="pos" stackId="x" fill="var(--positive)" fillOpacity={0.85} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Repeats + Strengths + Anomalies */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="p-4">
            <SectionHeader title="Повторяющиеся проблемы" subtitle="Кластеры с повтором ≥ 6" />
            <div className="space-y-2">
              {repeats.map(r => {
                const topic = getTopic(r.topics[0]);
                return (
                  <div key={r.id} className="flex items-start gap-2.5 rounded-lg border bg-card p-2.5">
                    <Repeat className="mt-0.5 h-3.5 w-3.5 shrink-0 text-negative" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-medium">{topic?.name}</p>
                      <p className="line-clamp-1 text-[11px] text-muted-foreground">{r.text}</p>
                    </div>
                    <span className="rounded-md bg-negative-soft px-1.5 py-0.5 num text-[10px] font-semibold text-negative-foreground">×{r.repeatCount}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Рост сильных сторон" subtitle="Темы со стабильной позитивной динамикой" />
            <div className="space-y-2.5">
              {[
                { name: "Программа лояльности", growth: 34, mentions: 76 },
                { name: "Курьеры с распаковкой", growth: 28, mentions: 41 },
                { name: "Скорость поддержки", growth: 19, mentions: 53 },
                { name: "Цена ниже рынка", growth: 12, mentions: 38 },
              ].map(s => (
                <div key={s.name} className="rounded-lg border border-positive/20 bg-positive-soft/30 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">{s.name}</span>
                    <span className="inline-flex items-center gap-0.5 num text-[11px] font-semibold text-positive-foreground"><TrendingUp className="h-3 w-3" /> +{s.growth}%</span>
                  </div>
                  <p className="num mt-0.5 text-[10px] text-muted-foreground">{s.mentions} упоминаний</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Аномалии и всплески" subtitle="Внезапные изменения за 7 дней" />
            <div className="space-y-2">
              {ANOMALIES.map(a => {
                const topic = getTopic(a.topicId);
                const isPos = topic?.kind === "strength";
                return (
                  <div key={a.id} className={`flex items-start gap-2.5 rounded-lg border p-2.5 ${isPos ? "border-positive/30 bg-positive-soft/30" : "border-negative/30 bg-negative-soft/30"}`}>
                    <AlertTriangle className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${isPos ? "text-positive" : "text-negative"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">{topic?.name}</p>
                      <p className="text-[11px] text-muted-foreground">{a.description}</p>
                    </div>
                    <span className={`num rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${isPos ? "bg-positive text-white" : "bg-negative text-white"}`}>+{a.spike}%</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Source ratings + Insights */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="col-span-2 p-4">
            <SectionHeader title="Средняя оценка по площадкам" subtitle="Я.Маркет · Otzovik · 2GIS · Google Maps" />
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SOURCE_RATINGS}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[3, 5]} stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <RTooltip {...chartTooltip} />
                  <Line dataKey="Я.Маркет" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                  <Line dataKey="Otzovik" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                  <Line dataKey="2GIS" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                  <Line dataKey="Google Maps" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px]">
              {[["Я.Маркет","var(--chart-1)"],["Otzovik","var(--chart-3)"],["2GIS","var(--chart-2)"],["Google Maps","var(--chart-4)"]].map(([n,c]) => (
                <span key={n} className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{background:c}}/>{n}</span>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AiBadge />
                <h3 className="text-sm font-semibold">Свежие AI-инсайты</h3>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs">Все <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
            </div>
            <div className="space-y-2.5">
              {recentInsights.map(i => (
                <div key={i.id} className="rounded-lg border border-ai/20 bg-gradient-to-br from-ai-soft/40 to-transparent p-2.5">
                  <div className="mb-1 flex items-center gap-1.5">
                    <TopicChip name={getTopic(i.topicId)?.name ?? ""} kind={getTopic(i.topicId)?.kind} />
                  </div>
                  <p className="line-clamp-2 text-xs font-medium">{i.title}</p>
                  <p className="num mt-1 text-[10px] text-muted-foreground">conf {i.confidence}% · {i.expectedEffect}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Inline insights showcase */}
        <div>
          <SectionHeader title="Сильные инсайты периода" subtitle="Готовы к обсуждению с командой" action={<Button variant="outline" size="sm" className="h-8 text-xs">Открыть Insights</Button>} />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {INSIGHTS.slice(0, 3).map(i => <InsightCard key={i.id} insight={i} />)}
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line */}
      <style>{`
        :root .recharts-cartesian-axis-tick text { font-family: var(--font-sans); }
      `}</style>
      {/* hidden helper to satisfy unused */}
      <span className="hidden"><SentimentPill sentiment="positive" /></span>
    </AppShell>
  );
}
