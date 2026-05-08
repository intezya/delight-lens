import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AiBadge,
  ConfidenceBar,
  Delta,
  ImpactIcon,
  PriorityBadge,
  SectionHeader,
  SentimentPill,
  SignalBar,
  SourceBadge,
  StatusBadge,
  TopicChip,
} from "@/components/atoms";
import {
  INSIGHTS,
  REVIEWS,
  SOURCES,
  TIMESERIES,
  getInsight,
  getTopic,
  type Source,
} from "@/lib/mock/data";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Flame,
  HelpCircle,
  Lightbulb,
  MessageSquareQuote,
  Quote,
  Repeat,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/insights/$insightId")({
  head: ({ params }) => ({
    meta: [
      { title: `Гипотеза ${params.insightId} — Voicelens` },
      { name: "description", content: "Детальный разбор AI-гипотезы: доказательства, приоритет, рекомендации." },
    ],
  }),
  loader: ({ params }) => {
    const insight = getInsight(params.insightId);
    if (!insight) throw notFound();
    return { insight };
  },
  notFoundComponent: () => (
    <AppShell title="Гипотеза не найдена">
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Такой гипотезы нет. <Link to="/insights" className="underline">К списку</Link></p>
      </div>
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell title="Ошибка">
      <div className="p-6 text-sm text-muted-foreground">{error.message}</div>
    </AppShell>
  ),
  component: InsightDetailPage,
});

function InsightDetailPage() {
  const { insightId } = Route.useParams();
  const insight = getInsight(insightId)!;
  const topic = getTopic(insight.topicId);
  const [createdAgo, setCreatedAgo] = useState("");

  useEffect(() => {
    setCreatedAgo(formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true, locale: ru }));
  }, [insight.createdAt]);

  // Evidence: pick a few topic-related reviews
  const evidence = REVIEWS.filter((r) => r.topics.includes(insight.topicId)).slice(0, 5);
  const clusterReviews = REVIEWS.filter((r) => r.topics.includes(insight.topicId));
  const clusterSize = clusterReviews.length * 4 + 5; // simulate scale
  const negShare = Math.round(
    (clusterReviews.filter((r) => r.sentiment === "negative").length / Math.max(1, clusterReviews.length)) * 100,
  );
  const repeatRate = Math.round(
    (clusterReviews.filter((r) => r.repeatCount > 3).length / Math.max(1, clusterReviews.length)) * 100,
  );

  const sourceContribution = SOURCES.map((s) => ({
    source: s as Source,
    count: clusterReviews.filter((r) => r.source === s).length * 3,
  }))
    .sort((a, b) => b.count - a.count)
    .filter((s) => s.count > 0);

  const totalContribution = sourceContribution.reduce((sum, s) => sum + s.count, 0);

  // Time series for the topic
  const series = TIMESERIES.slice(-30).map((d, i) => ({
    label: d.label,
    volume: Math.max(0, Math.round(d.negative * 0.4 + Math.sin(i / 3) * 4 + 6)),
  }));

  // Priority breakdown
  const severityScore = Math.min(100, Math.round((insight.signal + (insight.priority === "critical" ? 30 : insight.priority === "high" ? 18 : 8)) / 1.2));
  const frequencyScore = Math.min(100, clusterSize);
  const businessImpactScore = insight.confidence;
  const urgencyScore = Math.min(100, insight.signal + (insight.priority === "critical" ? 12 : 0));

  const [decision, setDecision] = useState<"accept" | "reject" | "more_data" | null>(null);
  const [reason, setReason] = useState("");
  const [assignTo, setAssignTo] = useState(insight.owner.team);
  const [priority, setPriority] = useState(insight.priority);

  const ifThen = buildIfThen(insight);

  return (
    <AppShell
      title={insight.title}
      subtitle={topic ? `Тема · ${topic.name}` : undefined}
      actions={
        <Button asChild size="sm" variant="outline" className="h-8 text-xs">
          <Link to="/insights"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> К списку</Link>
        </Button>
      }
    >
      <div className="mx-auto max-w-[1200px] space-y-10 p-4 md:p-8 lg:p-10">
        {/* Breadcrumb */}
        <nav className="anim-fade-in flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/insights" className="hover:text-foreground">Insights</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{insight.id.toUpperCase()}</span>
        </nav>

        {/* === HEADER === */}
        <Card className="anim-rise relative overflow-hidden border-ai/30 bg-gradient-to-br from-ai-soft/40 via-card to-card p-8 shadow-[var(--shadow-elev-2)] md:p-10">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-15" />
          <div className="relative space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <AiBadge />
                <StatusBadge status={insight.status} />
                <PriorityBadge priority={insight.priority} />
                {topic && <TopicChip name={topic.name} kind={topic.kind} />}
              </div>
              <h1 className="display text-3xl font-semibold leading-[1.15] tracking-tight md:text-[34px]">
                {insight.title}
              </h1>
              <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
                {insight.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span className="font-medium text-foreground">{insight.owner.name}</span> · {insight.owner.team}
                </span>
                <span className="inline-flex items-center gap-1.5" suppressHydrationWarning>
                  <Calendar className="h-3.5 w-3.5" />
                  Создано {createdAgo}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Период: последние 30 дней
                </span>
              </div>
            </div>

            <Separator className="bg-border/60" />

            <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
              <MetricTile label="Confidence">
                <ConfidenceBar value={insight.confidence} />
              </MetricTile>
              <MetricTile label="Сила сигнала">
                <SignalBar value={insight.signal} className="!w-full [&>div:first-child]:flex-1" />
              </MetricTile>
              <MetricTile label="Тип эффекта">
                <ImpactIcon impact={insight.impact} />
              </MetricTile>
              <MetricTile label="Ожидаемый эффект">
                <p className="num text-sm font-semibold text-ai-foreground">{insight.expectedEffect}</p>
              </MetricTile>
            </div>
          </div>
        </Card>

        {/* === AI EXPLANATION === */}
        <Card className="anim-rise border-l-4 border-l-ai p-6 md:p-8" style={{ animationDelay: "80ms" }}>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ai-soft text-ai-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-base font-semibold tracking-tight">Почему система это предложила</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  AI обнаружил кластер из <span className="num font-semibold text-foreground">{clusterSize} отзывов</span> по теме «{topic?.name.toLowerCase()}»,
                  сгруппированных по повторяющемуся сценарию. Жалобы концентрируются в определённых сегментах и площадках, что указывает на системную причину, а не разовый случай.
                </p>
              </div>
              <div className="stagger grid gap-3 sm:grid-cols-3">
                <ObservationItem icon={Repeat} label="Повторяющийся паттерн" value={`${repeatRate}% отзывов в кластере — повторные жалобы`} />
                <ObservationItem icon={Flame} label="Концентрация" value={`${negShare}% — негатив внутри темы`} />
                <ObservationItem icon={TrendingUp} label="Бизнес-сигнал" value={`Сила ${insight.signal}/100, confidence ${insight.confidence}%`} />
              </div>
            </div>
          </div>
        </Card>

        {/* === TABS === */}
        <Tabs defaultValue="evidence" className="anim-rise w-full" style={{ animationDelay: "160ms" }}>
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg bg-muted/50 p-1">
            <TabsTrigger value="evidence" className="gap-1.5 px-4 py-2 text-xs data-[state=active]:bg-card">
              <Quote className="h-3.5 w-3.5" /> Доказательства
              <span className="ml-1 rounded-full bg-muted px-1.5 text-[10px] num">{clusterReviews.length}</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-1.5 px-4 py-2 text-xs data-[state=active]:bg-card">
              <TrendingUp className="h-3.5 w-3.5" /> Данные
            </TabsTrigger>
            <TabsTrigger value="priority" className="gap-1.5 px-4 py-2 text-xs data-[state=active]:bg-card">
              <Flame className="h-3.5 w-3.5" /> Приоритет
            </TabsTrigger>
            <TabsTrigger value="action" className="gap-1.5 px-4 py-2 text-xs data-[state=active]:bg-card">
              <Lightbulb className="h-3.5 w-3.5" /> В работу
            </TabsTrigger>
            <TabsTrigger value="decision" className="gap-1.5 px-4 py-2 text-xs data-[state=active]:bg-card">
              <Check className="h-3.5 w-3.5" /> Решение
            </TabsTrigger>
          </TabsList>

          {/* --- EVIDENCE --- */}
          <TabsContent value="evidence" className="mt-8 space-y-6 anim-fade-in">
            <SectionHeader
              title="Конкретные отзывы"
              subtitle="На которых построена гипотеза"
              action={<Button variant="ghost" size="sm" className="h-7 text-xs">Все {clusterReviews.length} <ArrowRight className="ml-1 h-3 w-3" /></Button>}
            />
            <div className="stagger grid gap-4 md:grid-cols-2">
              {evidence.map((r) => (
                <Card key={r.id} className="lift group flex flex-col gap-3 border p-5 hover:border-ai/40">
                  <div className="flex items-start gap-2.5">
                    <Quote className="mt-1 h-4 w-4 shrink-0 text-ai/60" />
                    <p className="text-sm leading-relaxed text-foreground">«{r.text}»</p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t pt-3 text-[11px]">
                    <SentimentPill sentiment={r.sentiment} />
                    <SourceBadge source={r.source} />
                    <span className="text-muted-foreground">· {format(new Date(r.date), "d MMM yyyy", { locale: ru })}</span>
                    <div className="ml-auto flex flex-wrap gap-1">
                      {r.topics.slice(0, 2).map((t) => {
                        const tp = getTopic(t);
                        return tp ? <TopicChip key={t} name={tp.name} kind={tp.kind} /> : null;
                      })}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* --- DATA --- */}
          <TabsContent value="data" className="mt-8 space-y-6 anim-fade-in">
            <SectionHeader title="Сводка по данным" subtitle="Объём кластера, динамика, вклад площадок" />
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6 md:p-7">
                <div className="grid grid-cols-2 gap-6">
                  <SummaryStat label="Отзывов в кластере" value={clusterSize.toString()} hint="за 30 дней" />
                  <SummaryStat label="Доля негатива" value={`${negShare}%`} hint={<Delta value={6} invert />} />
                  <SummaryStat label="Повторяемость" value={`${repeatRate}%`} hint="повторные жалобы" />
                  <SummaryStat label="Δ за 30 дней" value="+24%" hint={<span className="text-negative">рост обращений</span>} />
                </div>
                <Separator className="my-6" />
                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">Вклад площадок</p>
                  <div className="space-y-3">
                    {sourceContribution.slice(0, 5).map((s) => {
                      const pct = Math.round((s.count / Math.max(1, totalContribution)) * 100);
                      return (
                        <div key={s.source} className="flex items-center gap-3">
                          <div className="w-24 shrink-0">
                            <SourceBadge source={s.source} />
                          </div>
                          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full bg-ai/70 transition-[width] duration-700 ease-out"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="num w-10 text-right text-[11px] font-medium tabular-nums text-muted-foreground">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              <Card className="flex flex-col p-6 md:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold">Динамика темы за 30 дней</p>
                  <span className="num text-[10px] text-muted-foreground">обращений / день</span>
                </div>
                <div className="h-[300px] flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <defs>
                        <linearGradient id="grad-vol" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--ai)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="var(--ai)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} interval={4} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                      <RTooltip
                        contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: "var(--muted-foreground)", fontSize: 11 }}
                      />
                      <Area type="monotone" dataKey="volume" stroke="var(--ai)" strokeWidth={2} fill="url(#grad-vol)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* --- PRIORITY --- */}
          <TabsContent value="priority" className="mt-8 space-y-6 anim-fade-in">
            <SectionHeader title="Почему это приоритетно" subtitle="Оценка по 4 измерениям" />
            <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PriorityTile icon={Flame} title="Severity" score={severityScore} description="Тяжесть последствий для клиента и репутации" tone="negative" />
              <PriorityTile icon={Repeat} title="Frequency" score={frequencyScore} description="Как часто проблема повторяется в отзывах" tone="mixed" />
              <PriorityTile icon={Building2} title="Business impact" score={businessImpactScore} description="Влияние на retention, рейтинг площадок, конверсию" tone="ai" />
              <PriorityTile icon={Zap} title="Urgency" score={urgencyScore} description="Скорость нарастания и риск эскалации" tone="negative" />
            </div>
          </TabsContent>

          {/* --- ACTIONABLE --- */}
          <TabsContent value="action" className="mt-8 space-y-6 anim-fade-in">
            <SectionHeader title="Что можно передать в работу" subtitle="Готовая формулировка и первый шаг" />
            <Card className="overflow-hidden">
              <div className="border-l-4 border-l-positive bg-positive-soft/30 p-6 md:p-8">
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-positive" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-positive-foreground">Гипотеза в формате «если…, то…»</span>
                </div>
                <p className="text-base leading-relaxed text-foreground">
                  <span className="font-semibold">Если</span> {ifThen.condition}, <span className="font-semibold">то</span> {ifThen.outcome}.
                </p>
              </div>
              <div className="grid gap-0 sm:grid-cols-3">
                <HandoffField icon={Users} label="Кому передать" value={insight.owner.team} sub={insight.owner.name} />
                <HandoffField icon={Target} label="Ожидаемый результат" value={insight.expectedEffect} sub="за 4–6 недель" />
                <HandoffField icon={ArrowRight} label="Первый шаг" value={ifThen.firstStep} sub="ответственный — владелец гипотезы" last />
              </div>
            </Card>
          </TabsContent>

          {/* --- DECISION --- */}
          <TabsContent value="decision" className="mt-8 space-y-6 anim-fade-in">
            <SectionHeader title="Решение пользователя" subtitle="Зафиксируйте вердикт и передайте в работу" />
            <Card className="p-6 md:p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Вердикт</p>
                  <div className="stagger grid gap-3">
                    <DecisionButton
                      active={decision === "accept"}
                      onClick={() => setDecision("accept")}
                      icon={Check}
                      title="Принять гипотезу"
                      description="Передать в работу команде"
                      tone="positive"
                    />
                    <DecisionButton
                      active={decision === "reject"}
                      onClick={() => setDecision("reject")}
                      icon={X}
                      title="Отклонить"
                      description="Не подтверждается или не релевантно"
                      tone="negative"
                    />
                    <DecisionButton
                      active={decision === "more_data"}
                      onClick={() => setDecision("more_data")}
                      icon={HelpCircle}
                      title="Нужны дополнительные данные"
                      description="Запросить у AI ещё доказательств"
                      tone="mixed"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="reason" className="text-xs font-medium">
                      Почему {decision === "reject" ? "отклонено" : "принято"}
                    </Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Короткое обоснование решения — увидят коллеги в истории гипотезы"
                      className="mt-2 min-h-[120px] text-sm"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="assign" className="text-xs font-medium">Кому передать</Label>
                      <Input id="assign" value={assignTo} onChange={(e) => setAssignTo(e.target.value)} className="mt-2 h-9 text-sm" />
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-xs font-medium">Приоритет</Label>
                      <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                        <SelectTrigger id="priority" className="mt-2 h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-3">
                    <p className="text-[11px] text-muted-foreground">
                      {decision ? "Решение готово к фиксации" : "Выберите вердикт слева, чтобы продолжить"}
                    </p>
                    <Button size="sm" disabled={!decision} className="press h-9 text-xs">
                      <Send className="mr-1.5 h-3.5 w-3.5" /> Зафиксировать решение
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related insights footer */}
        <section className="pt-2">
          <SectionHeader title="Связанные гипотезы" subtitle="По той же теме или похожему паттерну" />
          <div className="grid gap-2 md:grid-cols-3">
            {INSIGHTS.filter((i) => i.id !== insight.id && i.topicId === insight.topicId).slice(0, 3).map((i) => (
              <Link key={i.id} to="/insights/$insightId" params={{ insightId: i.id }}>
                <Card className="group flex items-start gap-3 p-3 transition hover:border-ai/40 hover:shadow-[var(--shadow-elev-1)]">
                  <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-ai/70" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{i.title}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <StatusBadge status={i.status} />
                      <span className="num text-[10px] text-muted-foreground">conf {i.confidence}%</span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Card>
              </Link>
            ))}
            {INSIGHTS.filter((i) => i.id !== insight.id && i.topicId === insight.topicId).length === 0 && (
              <p className="text-xs text-muted-foreground">Других гипотез по этой теме пока нет.</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function buildIfThen(insight: { topicId: string; expectedEffect: string }) {
  const map: Record<string, { condition: string; outcome: string; firstStep: string }> = {
    delay: {
      condition: "расширить доступные слоты доставки в выходные и добавить отдельный контроль предпраздничных дней",
      outcome: "число повторных жалоб на перенос сроков снизится на 25% за 4 недели",
      firstStep: "согласовать с логистикой пилот на 2 региона с наибольшей долей жалоб",
    },
    warranty: {
      condition: "ввести SLA 48 часов на первый ответ по гарантии и автоматический эскалейт",
      outcome: "доля негативных отзывов по гарантии снизится на 22%",
      firstStep: "выгрузить топ-20 кейсов с просрочкой и запустить разбор с Customer Care",
    },
    payment: {
      condition: "добавить мгновенную проверку статуса платежа и авто-возврат при ошибке",
      outcome: "число жалоб на двойное списание снизится на 30%",
      firstStep: "проверить логи платёжного шлюза за последние 30 дней",
    },
    defective: {
      condition: "ввести фотофиксацию состояния товара перед отгрузкой и маркировать витринные образцы",
      outcome: "доля жалоб на «витринный товар как новый» снизится на 18%",
      firstStep: "обновить регламент приёмки на складе",
    },
    fake: {
      condition: "включить проверку серийных номеров через API производителей в момент приёмки",
      outcome: "жалобы на подделки в категории Аудио снизятся на 15%",
      firstStep: "согласовать с Quality пилот на одной категории",
    },
    "loyalty-bonus": {
      condition: "усилить коммуникацию о бонусах при оформлении заказа и в email-рассылках",
      outcome: "позитивные упоминания программы лояльности вырастут на 12%",
      firstStep: "запросить у Marketing креативы и план A/B-теста",
    },
    positive: {
      condition: "стандартизировать чек-лист курьера «распаковка при клиенте»",
      outcome: "средняя оценка по площадкам вырастет на 0.3★",
      firstStep: "обновить инструкцию для last-mile и обучить 50 курьеров пилота",
    },
  };
  return (
    map[insight.topicId] ?? {
      condition: "внедрить рекомендацию системы по этой теме",
      outcome: insight.expectedEffect,
      firstStep: "согласовать ответственного и срок пилота",
    }
  );
}

function MetricTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card/80 p-3 shadow-[var(--shadow-elev-1)] backdrop-blur">
      <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function ObservationItem({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ai" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-xs font-medium leading-snug">{value}</p>
      </div>
    </div>
  );
}

function SummaryStat({ label, value, hint }: { label: string; value: string; hint?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="num display mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

function PriorityTile({
  icon: Icon,
  title,
  score,
  description,
  tone,
}: {
  icon: typeof Flame;
  title: string;
  score: number;
  description: string;
  tone: "negative" | "mixed" | "ai" | "positive";
}) {
  const toneCls = {
    negative: "text-negative bg-negative-soft",
    mixed: "text-mixed-foreground bg-mixed-soft",
    ai: "text-ai-foreground bg-ai-soft",
    positive: "text-positive-foreground bg-positive-soft",
  }[tone];
  const barCls = {
    negative: "bg-negative",
    mixed: "bg-mixed",
    ai: "bg-ai",
    positive: "bg-positive",
  }[tone];
  return (
    <Card className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <div className={`flex h-7 w-7 items-center justify-center rounded-md ${toneCls}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="num display text-xl font-semibold tabular-nums">{score}<span className="text-xs text-muted-foreground">/100</span></span>
      </div>
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${barCls}`} style={{ width: `${score}%` }} />
      </div>
    </Card>
  );
}

function HandoffField({
  icon: Icon,
  label,
  value,
  sub,
  last,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub?: string;
  last?: boolean;
}) {
  return (
    <div className={`p-4 ${last ? "" : "border-b sm:border-b-0 sm:border-r"}`}>
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className="text-sm font-medium leading-snug">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function DecisionButton({
  active,
  onClick,
  icon: Icon,
  title,
  description,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Check;
  title: string;
  description: string;
  tone: "positive" | "negative" | "mixed";
}) {
  const activeCls = {
    positive: "border-positive bg-positive-soft/60",
    negative: "border-negative bg-negative-soft/60",
    mixed: "border-mixed bg-mixed-soft/60",
  }[tone];
  const iconCls = {
    positive: "text-positive bg-positive-soft",
    negative: "text-negative bg-negative-soft",
    mixed: "text-mixed-foreground bg-mixed-soft",
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition hover:border-foreground/20 ${
        active ? activeCls : "border-border bg-card"
      }`}
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${iconCls}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <span
        className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
          active ? "border-foreground bg-foreground" : "border-muted-foreground/30"
        }`}
      />
    </button>
  );
}
