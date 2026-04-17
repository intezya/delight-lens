import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TOPICS, REVIEWS, INSIGHTS, IMPACT_CASES, TIMESERIES, getTopic } from "@/lib/mock/data";
import { SentimentPill, TopicChip, SourceBadge, SignalBar, PriorityBadge, AiBadge, SectionHeader } from "@/components/atoms";
import { InsightCard } from "@/components/insight-card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import { ArrowLeft, Quote, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const Route = createFileRoute("/topics/$topicId")({
  loader: ({ params }) => {
    const topic = TOPICS.find(t => t.id === params.topicId);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.topic.name ?? "Тема"} — Voicelens` },
      { name: "description", content: `Детальный AI-разбор темы «${loaderData?.topic.name}»` },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center"><Link to="/topics" className="text-sm">← Все темы</Link></div>
  ),
  component: TopicDetailPage,
});

const tt = {
  contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11, padding: 8 },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 10 },
  cursor: { stroke: "var(--border)", strokeDasharray: "3 3" },
};

function TopicDetailPage() {
  const { topic } = Route.useLoaderData();
  const reviews = REVIEWS.filter(r => r.topics.includes(topic.id));
  const pos = reviews.filter(r => r.sentiment === "positive").length;
  const neg = reviews.filter(r => r.sentiment === "negative").length;
  const mix = reviews.filter(r => r.sentiment === "mixed").length;
  const insights = INSIGHTS.filter(i => i.topicId === topic.id);
  const impacts = IMPACT_CASES.filter(c => c.topicId === topic.id);

  const segments = [
    { name: "Москва", value: 38 }, { name: "СПб", value: 24 }, { name: "Екатеринбург", value: 14 }, { name: "Казань", value: 12 }, { name: "Новосибирск", value: 8 }, { name: "Краснодар", value: 4 },
  ];
  const patterns = [
    { name: "«звонишь — обещают перезвонить — не перезванивают»", count: 13 },
    { name: "«сроки срывают 3+ раз»", count: 11 },
    { name: "«серийник не пробивается»", count: 9 },
    { name: "«деньги списались — заказа нет»", count: 9 },
  ];
  const quotes = reviews.slice(0, 4);
  const series = TIMESERIES.slice(-60).map(d => ({ ...d, topic: Math.round((d.negative + d.positive) * 0.35 + Math.random() * 6) }));

  const kindColor = topic.kind === "strength" ? "var(--positive)" : topic.kind === "opportunity" ? "var(--ai)" : "var(--negative)";

  return (
    <AppShell title={topic.name} subtitle={`Детальный разбор темы · ${reviews.length} отзывов · AI-анализ`}>
      <div className="space-y-5 p-4 md:p-6">
        <Link to="/topics" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Все темы</Link>

        {/* Header card */}
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <div className="mb-2 flex items-center gap-2"><TopicChip name={topic.kind === "risk" ? "Risk" : topic.kind === "strength" ? "Strength" : "Opportunity"} kind={topic.kind} /><AiBadge /></div>
              <h2 className="display text-2xl font-semibold tracking-tight">{topic.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Тема концентрируется в категории «Электроника», 62% упоминаний с тональностью {topic.kind === "strength" ? "позитив" : "негатив"}. AI выделил {patterns.length} устойчивых паттернов и {insights.length} актуальных гипотез.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border bg-card px-3 py-2"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Отзывов</p><p className="num display text-xl font-semibold">{reviews.length}</p></div>
              <div className="rounded-lg border bg-card px-3 py-2"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Гипотез</p><p className="num display text-xl font-semibold">{insights.length}</p></div>
              <div className="rounded-lg border bg-card px-3 py-2"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Внедрено</p><p className="num display text-xl font-semibold">{impacts.length}</p></div>
            </div>
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="col-span-2 p-4">
            <SectionHeader title="Динамика темы" subtitle="Объём упоминаний и индекс тональности" />
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="tdg" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={kindColor} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={kindColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} interval={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <RTooltip {...tt} />
                  <Area dataKey="topic" stroke={kindColor} strokeWidth={2} fill="url(#tdg)" type="monotone" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Доля тональности" subtitle="Внутри темы" />
            <div className="flex items-center gap-3">
              <div className="h-[180px] w-[180px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ n: "pos", v: pos }, { n: "mix", v: mix }, { n: "neg", v: neg }]} dataKey="v" innerRadius={50} outerRadius={75} paddingAngle={2}>
                      <Cell fill="var(--positive)" />
                      <Cell fill="var(--mixed)" />
                      <Cell fill="var(--negative)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-positive" />Позитив</span><span className="num font-medium">{pos}</span></div>
                <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-mixed" />Смешанный</span><span className="num font-medium">{mix}</span></div>
                <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-negative" />Негатив</span><span className="num font-medium">{neg}</span></div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="p-4">
            <SectionHeader title="Повторяющиеся паттерны" subtitle="Кластеры формулировок" />
            <div className="space-y-2">
              {patterns.map(p => (
                <div key={p.name} className="flex items-start gap-2 rounded-lg border bg-card p-2.5">
                  <Quote className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                  <p className="flex-1 text-xs">{p.name}</p>
                  <span className="num rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold">×{p.count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Сегменты" subtitle="Где встречается чаще" />
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segments} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={100} />
                  <RTooltip {...tt} />
                  <Bar dataKey="value" fill={kindColor} fillOpacity={0.85} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Ключевые цитаты" subtitle="Из реальных отзывов" />
            <div className="space-y-2">
              {quotes.map(q => (
                <blockquote key={q.id} className={`rounded-lg border-l-2 bg-muted/30 p-2.5 text-xs ${q.sentiment === "positive" ? "border-positive" : q.sentiment === "negative" ? "border-negative" : "border-mixed"}`}>
                  <p className="line-clamp-3 italic">«{q.text}»</p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                    <SourceBadge source={q.source} />
                    <span>{q.author}</span>
                  </div>
                </blockquote>
              ))}
            </div>
          </Card>
        </div>

        {insights.length > 0 && (
          <div>
            <SectionHeader title="Связанные AI-гипотезы" subtitle="Сгенерированы на основе этой темы" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {insights.map(i => <InsightCard key={i.id} insight={i} />)}
            </div>
          </div>
        )}

        {impacts.length > 0 && (
          <Card className="p-4">
            <SectionHeader title="Принятые действия и эффект" subtitle="Таймлайн внедрений" />
            <div className="space-y-3">
              {impacts.map(c => (
                <div key={c.id} className="flex items-start gap-3 rounded-lg border bg-card p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-positive" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{c.action}</p>
                    <p className="num mt-0.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground"><Clock className="h-3 w-3" /> Внедрено {format(new Date(c.deployedAt), "d MMM yyyy", { locale: ru })}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-right text-[10px]">
                    <div><p className="text-muted-foreground">Sentiment</p><p className="num font-semibold text-positive">{c.before.sentiment} → {c.after.sentiment}</p></div>
                    <div><p className="text-muted-foreground">Rating</p><p className="num font-semibold">{c.before.rating} → {c.after.rating}</p></div>
                    <div><p className="text-muted-foreground">Жалоб</p><p className="num font-semibold text-positive">{c.before.complaints} → {c.after.complaints}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b p-3">
            <SectionHeader title="Связанные отзывы" subtitle={`${reviews.length} отзывов в теме`} />
            <Link to="/reviews"><Button variant="outline" size="sm" className="h-7 text-xs">Все отзывы</Button></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Текст</th>
                  <th className="px-2 py-2 text-left font-medium">Тон.</th>
                  <th className="px-2 py-2 text-left font-medium">Сигнал</th>
                  <th className="px-2 py-2 text-left font-medium">Источник</th>
                  <th className="px-2 py-2 text-left font-medium">Дата</th>
                  <th className="px-2 py-2 text-left font-medium">Приор.</th>
                </tr>
              </thead>
              <tbody>
                {reviews.slice(0, 8).map(r => (
                  <tr key={r.id} className="border-b transition hover:bg-muted/30">
                    <td className="max-w-[420px] px-4 py-2.5"><span className="line-clamp-1">{r.text}</span></td>
                    <td className="px-2 py-2.5"><SentimentPill sentiment={r.sentiment} /></td>
                    <td className="px-2 py-2.5"><SignalBar value={r.signal} /></td>
                    <td className="px-2 py-2.5"><SourceBadge source={r.source} /></td>
                    <td className="px-2 py-2.5 num text-muted-foreground">{format(new Date(r.date), "d MMM", { locale: ru })}</td>
                    <td className="px-2 py-2.5"><PriorityBadge priority={r.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
