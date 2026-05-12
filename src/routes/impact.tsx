import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ImpactSkeleton } from "@/components/skeletons/impact";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IMPACT_CASES,
  INSIGHTS,
  TOPIC_DISTRIBUTION,
  getTopic,
  getInsight,
  localizeTeam,
  TIMESERIES,
  SOURCE_RATINGS,
} from "@/lib/mock/data";
import { SectionHeader, Delta, TopicChip } from "@/components/atoms";
import { KpiCard } from "@/components/kpi-card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const Route = createFileRoute("/impact")({
  pendingComponent: ImpactSkeleton,
  pendingMs: 120,
  pendingMinMs: 180,
  head: () => ({
    meta: [
      { title: "Impact — Voicelens" },
      { name: "description", content: "Эффект внедрённых решений на тональность и метрики." },
    ],
  }),
  component: ImpactPage,
});

const tt = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    fontSize: 11,
    padding: 8,
  },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 10 },
  cursor: { stroke: "var(--border)", strokeDasharray: "3 3" },
};

const axisLabelStyle = { fill: "var(--muted-foreground)", fontSize: 10 };

function TrendChart() {
  return (
    <Card className="motion-surface p-4">
      <SectionHeader title="Динамика тональности" subtitle="Объём по тональности · 90 дней" />
      <div className="motion-chart h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TIMESERIES} margin={{ left: 8, right: 8, bottom: 18 }}>
            <defs>
              <linearGradient id="impact-trend-pos" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--positive)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--positive)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="impact-trend-neg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--negative)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--negative)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={11}
            >
              <Label value="Дата" position="insideBottom" offset={-12} style={axisLabelStyle} />
            </XAxis>
            <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false}>
              <Label
                value="Количество отзывов"
                angle={-90}
                position="insideLeft"
                style={axisLabelStyle}
              />
            </YAxis>
            <RTooltip {...tt} />
            <Area
              type="monotone"
              dataKey="positive"
              name="Позитив"
              stackId="1"
              stroke="var(--positive)"
              strokeWidth={1.5}
              fill="url(#impact-trend-pos)"
            />
            <Area
              type="monotone"
              dataKey="negative"
              name="Негатив"
              stackId="1"
              stroke="var(--negative)"
              strokeWidth={1.5}
              fill="url(#impact-trend-neg)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function DivergingChart() {
  const data = TOPIC_DISTRIBUTION.slice(0, 7).map((t) => ({
    name: t.name.length > 22 ? `${t.name.slice(0, 22)}...` : t.name,
    pos: t.positive,
    neg: -t.negative,
  }));
  return (
    <Card className="motion-surface p-4">
      <SectionHeader title="Вклад тем" subtitle="Слева негатив · справа позитив" />
      <div className="motion-chart h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            stackOffset="sign"
            margin={{ left: 8, right: 8, bottom: 18 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
            <XAxis
              type="number"
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            >
              <Label
                value="Количество отзывов"
                position="insideBottom"
                offset={-12}
                style={axisLabelStyle}
              />
            </XAxis>
            <YAxis
              type="category"
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={140}
            >
              <Label value="Темы" angle={-90} position="insideLeft" style={axisLabelStyle} />
            </YAxis>
            <RTooltip {...tt} />
            <ReferenceLine x={0} stroke="var(--border)" />
            <Bar
              dataKey="neg"
              name="Негатив"
              stackId="x"
              fill="var(--negative)"
              fillOpacity={0.85}
              radius={[4, 0, 0, 4]}
            />
            <Bar
              dataKey="pos"
              name="Позитив"
              stackId="x"
              fill="var(--positive)"
              fillOpacity={0.85}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function ImpactPage() {
  const totalDelta = IMPACT_CASES.reduce((s, c) => s + (c.after.sentiment - c.before.sentiment), 0);
  const avgEffect = Math.round(totalDelta / IMPACT_CASES.length);
  const featured = IMPACT_CASES[0];
  const beforeAfter = TIMESERIES.slice(-60).map((d, i) => ({
    label: d.label,
    before: i < 30 ? d.sentiment : null,
    after: i >= 30 ? d.sentiment + 18 : null,
  }));

  return (
    <AppShell title="Эффект изменений" subtitle="Как внедрённые решения повлияли на метрики">
      <div className="motion-page mx-auto w-full max-w-[1440px] space-y-5 px-3 py-4 sm:px-4 md:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Изменение тональности"
            value={`+${totalDelta}`}
            delta={12}
            hint="Сумма изменений по всем гипотезам"
            tone="positive"
          />
          <KpiCard
            label="Внедрено гипотез"
            value={IMPACT_CASES.length}
            delta={50}
            hint="За последние 90 дней"
            tone="ai"
          />
          <KpiCard
            label="Средний эффект"
            value={`+${avgEffect}`}
            delta={8}
            suffix="п."
            hint="Средний прирост индекса тональности"
            tone="positive"
          />
          <KpiCard
            label="Окупаемость гипотез"
            value="3.2×"
            delta={18}
            suffix=""
            hint="Эффект ÷ затраченные часы аналитики"
            tone="ai"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TrendChart />
          <DivergingChart />
        </div>

        {/* Featured before/after */}
        <Card className="motion-surface p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Внедрение
                </span>
                <TopicChip
                  name={getTopic(featured.topicId)?.name ?? ""}
                  kind={getTopic(featured.topicId)?.kind}
                />
              </div>
              <h3 className="text-base font-semibold tracking-tight">{featured.action}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Гипотеза: «{getInsight(featured.insightId)?.title}» · внедрено{" "}
                {format(new Date(featured.deployedAt), "d MMM yyyy", { locale: ru })}
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 text-left sm:w-auto sm:text-right">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Тональность
                </p>
                <p className="num display text-xl font-semibold">
                  {featured.before.sentiment} <span className="text-muted-foreground/50">→</span>{" "}
                  <span className="text-positive">{featured.after.sentiment}</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Жалоб</p>
                <p className="num display text-xl font-semibold">
                  {featured.before.complaints} <span className="text-muted-foreground/50">→</span>{" "}
                  <span className="text-positive">{featured.after.complaints}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="motion-chart h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={beforeAfter} margin={{ left: 8, right: 8, bottom: 18 }}>
                <defs>
                  <linearGradient id="ba-b" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--negative)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--negative)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ba-a" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--positive)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--positive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  interval={9}
                  tickLine={false}
                  axisLine={false}
                >
                  <Label value="Дата" position="insideBottom" offset={-12} style={axisLabelStyle} />
                </XAxis>
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                >
                  <Label
                    value="Индекс тональности"
                    angle={-90}
                    position="insideLeft"
                    style={axisLabelStyle}
                  />
                </YAxis>
                <RTooltip {...tt} />
                <Area
                  dataKey="before"
                  stroke="var(--negative)"
                  strokeWidth={2}
                  fill="url(#ba-b)"
                  type="monotone"
                  connectNulls={false}
                />
                <Area
                  dataKey="after"
                  stroke="var(--positive)"
                  strokeWidth={2}
                  fill="url(#ba-a)"
                  type="monotone"
                  connectNulls={false}
                />
                <ReferenceDot
                  x={beforeAfter[30]?.label}
                  y={0}
                  r={4}
                  fill="var(--ai)"
                  stroke="var(--background)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-negative" />
              До внедрения
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-positive" />
              После внедрения
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-ai" />
              Маркер деплоя
            </span>
          </div>
        </Card>

        {/* Cases table */}
        <Card className="motion-surface overflow-hidden">
          <div className="border-b p-3">
            <SectionHeader
              title="Все внедрения"
              subtitle="Гипотеза → действие → метрики до/после"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-xs">
              <thead className="border-b bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Гипотеза</th>
                  <th className="px-2 py-2.5 text-left font-medium">Действие</th>
                  <th className="px-2 py-2.5 text-left font-medium">Тема</th>
                  <th className="px-2 py-2.5 text-right font-medium">Тональность</th>
                  <th className="px-2 py-2.5 text-right font-medium">Оценка</th>
                  <th className="px-2 py-2.5 text-right font-medium">Жалоб</th>
                  <th className="px-2 py-2.5 text-right font-medium">Δ</th>
                </tr>
              </thead>
              <tbody>
                {IMPACT_CASES.map((c) => {
                  const ins = getInsight(c.insightId);
                  const topic = getTopic(c.topicId);
                  const dSent = c.after.sentiment - c.before.sentiment;
                  return (
                    <tr key={c.id} className="motion-row border-b">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-positive" />
                          <span className="line-clamp-1">{ins?.title}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-muted-foreground">{c.action}</td>
                      <td className="px-2 py-3">
                        {topic && <TopicChip name={topic.name} kind={topic.kind} />}
                      </td>
                      <td className="px-2 py-3 text-right num font-medium">
                        {c.before.sentiment} →{" "}
                        <span className="text-positive">{c.after.sentiment}</span>
                      </td>
                      <td className="px-2 py-3 text-right num">
                        {c.before.rating} → {c.after.rating}
                      </td>
                      <td className="px-2 py-3 text-right num">
                        {c.before.complaints} →{" "}
                        <span className="text-positive">{c.after.complaints}</span>
                      </td>
                      <td className="px-2 py-3 text-right">
                        <Delta value={dSent} suffix=" п." />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="motion-surface p-4">
            <SectionHeader
              title="Снижение повторяемости"
              subtitle="По темам с принятыми гипотезами"
            />
            <div className="motion-chart h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={IMPACT_CASES.map((c) => ({
                    name: getTopic(c.topicId)?.name?.slice(0, 16) ?? "",
                    before: c.before.complaints,
                    after: c.after.complaints,
                  }))}
                  margin={{ left: 8, right: 8, bottom: 18 }}
                >
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      value="Тема"
                      position="insideBottom"
                      offset={-12}
                      style={axisLabelStyle}
                    />
                  </XAxis>
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      value="Количество жалоб"
                      angle={-90}
                      position="insideLeft"
                      style={axisLabelStyle}
                    />
                  </YAxis>
                  <RTooltip {...tt} />
                  <Bar
                    dataKey="before"
                    fill="var(--negative)"
                    fillOpacity={0.5}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="after"
                    fill="var(--positive)"
                    fillOpacity={0.85}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="motion-surface p-4">
            <SectionHeader title="Изменение средней оценки" subtitle="Маркеры — деплои" />
            <div className="motion-chart h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SOURCE_RATINGS} margin={{ left: 8, right: 8, bottom: 18 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      value="Дата"
                      position="insideBottom"
                      offset={-12}
                      style={axisLabelStyle}
                    />
                  </XAxis>
                  <YAxis
                    domain={[3, 5]}
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      value="Средняя оценка"
                      angle={-90}
                      position="insideLeft"
                      style={axisLabelStyle}
                    />
                  </YAxis>
                  <RTooltip {...tt} />
                  <Line dataKey="Я.Маркет" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                  <Line dataKey="Otzovik" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                  <Line dataKey="2GIS" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                  <Line dataKey="Google Maps" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
                  <ReferenceDot
                    x={SOURCE_RATINGS[5]?.date}
                    y={4.3}
                    r={5}
                    fill="var(--ai)"
                    stroke="var(--background)"
                    strokeWidth={2}
                  />
                  <ReferenceDot
                    x={SOURCE_RATINGS[10]?.date}
                    y={4.4}
                    r={5}
                    fill="var(--ai)"
                    stroke="var(--background)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="motion-surface p-4">
          <SectionHeader title="Таймлайн внедрений" subtitle="Деплои на графике общего sentiment" />
          <div className="space-y-3">
            {IMPACT_CASES.map((c, i) => (
              <div key={c.id} className="flex items-start gap-3 sm:items-center sm:gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ai-soft text-[11px] font-semibold text-ai-foreground">
                  {i + 1}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{c.action}</p>
                    <p className="num text-[10px] text-muted-foreground">
                      {format(new Date(c.deployedAt), "d MMM yyyy", { locale: ru })} ·{" "}
                      {localizeTeam(INSIGHTS.find((i) => i.id === c.insightId)?.owner.team ?? "")}
                    </p>
                  </div>
                  <Delta value={c.after.sentiment - c.before.sentiment} suffix=" п." />
                  <Button size="sm" variant="ghost" className="h-7 w-full text-xs sm:w-auto">
                    Детали
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
