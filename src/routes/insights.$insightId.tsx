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
  ImpactIcon,
  PriorityBadge,
  SectionHeader,
  SignalBar,
  StatusBadge,
  TopicChip,
} from "@/components/atoms";
import { ConfidenceBreakdown } from "@/components/insight/ConfidenceBreakdown";
import { ExpectedEffectCard } from "@/components/insight/ExpectedEffectCard";
import { GenerationReason } from "@/components/insight/GenerationReason";
import { EvidenceList } from "@/components/insight/EvidenceList";
import { RisksList } from "@/components/insight/RisksList";
import { NeededDataPanel } from "@/components/insight/NeededDataPanel";
import { ImpactTracker } from "@/components/insight/ImpactTracker";
import { OwnerTeamCard } from "@/components/insight/OwnerTeamCard";
import {
  INSIGHTS,
  getInsight,
  getTopic,
  getSubtopic,
} from "@/lib/mock/data";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  HelpCircle,
  Lightbulb,
  MessageSquareQuote,
  Quote,
  Send,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

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
  const subtopic = insight.subtopicId ? getSubtopic(insight.subtopicId) : undefined;
  const [createdAgo, setCreatedAgo] = useState("");

  useEffect(() => {
    setCreatedAgo(formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true, locale: ru }));
  }, [insight.createdAt]);

  const [decision, setDecision] = useState<"accept" | "reject" | "more_data" | null>(
    insight.status === "needs_data" ? "more_data" : null,
  );
  const [reason, setReason] = useState("");
  const [assignTo, setAssignTo] = useState(insight.ownerTeam);
  const [priority, setPriority] = useState(insight.priority);

  const effect = insight.expectedEffectV2;
  const sign = effect.type === "complaints_reduction" || effect.type === "repeat_reduction" ? "−" : "+";
  const effectShort = `${sign}${effect.range.min}–${effect.range.max}${effect.unit}`;

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
        <nav className="anim-fade-in flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/insights" className="hover:text-foreground">Insights</Link>
          <ChevronRight className="h-3 w-3" />
          {topic && (
            <>
              <Link to="/topics/$topicId" params={{ topicId: topic.id }} className="hover:text-foreground">
                {topic.name}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          {subtopic && (
            <>
              <span className="hover:text-foreground">{subtopic.name}</span>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
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
                {subtopic && <span className="rounded-md border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground">{subtopic.name}</span>}
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
                  <span className="font-medium text-foreground">{insight.owner.name}</span> · {insight.ownerTeam}
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
              <MetricTile label={`Эффект · ${effect.label}`}>
                <p className="num text-sm font-semibold text-ai-foreground">{effectShort}</p>
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
            <div className="flex-1">
              <h3 className="text-base font-semibold tracking-tight">Кратко: что сказала система</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                Уверенность системы — <span className="font-semibold">{insight.confidence}%</span>, основана на{" "}
                <span className="font-semibold">{insight.confidenceBreakdown.reviewsCount} отзывах</span>,
                повторяемости проблемы и наличии жалоб в нескольких источниках. Потенциальный эффект — диапазон{" "}
                <span className="font-semibold num">{effectShort}</span> ({effect.label}). В разделе ниже — на чём построена
                эта оценка, какие отзывы её подтверждают и что может пойти не так.
              </p>
            </div>
          </div>
        </Card>

        {/* === TABS === */}
        <Tabs defaultValue="overview" className="anim-rise w-full" style={{ animationDelay: "160ms" }}>
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg bg-muted/50 p-1">
            <TabsTrigger value="overview" className="gap-1.5 px-4 py-2 text-xs data-[state=active]:bg-card">
              <TrendingUp className="h-3.5 w-3.5" /> Обзор
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-1.5 px-4 py-2 text-xs data-[state=active]:bg-card">
              <Quote className="h-3.5 w-3.5" /> Доказательства
              <span className="ml-1 rounded-full bg-muted px-1.5 text-[10px] num">{insight.evidenceReviews.length}</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="gap-1.5 px-4 py-2 text-xs data-[state=active]:bg-card">
              <ShieldAlert className="h-3.5 w-3.5" /> Риски и данные
            </TabsTrigger>
            <TabsTrigger value="action" className="gap-1.5 px-4 py-2 text-xs data-[state=active]:bg-card">
              <Lightbulb className="h-3.5 w-3.5" /> Действие
            </TabsTrigger>
            <TabsTrigger value="impact" className="gap-1.5 px-4 py-2 text-xs data-[state=active]:bg-card">
              <Check className="h-3.5 w-3.5" /> Эффект
            </TabsTrigger>
          </TabsList>

          {/* --- OVERVIEW --- */}
          <TabsContent value="overview" className="mt-8 space-y-6 anim-fade-in">
            <div className="grid gap-6 lg:grid-cols-2">
              <ConfidenceBreakdown value={insight.confidence} breakdown={insight.confidenceBreakdown} />
              <ExpectedEffectCard effect={insight.expectedEffectV2} />
            </div>
            <GenerationReason reasons={insight.generationReason} />
          </TabsContent>

          {/* --- EVIDENCE --- */}
          <TabsContent value="evidence" className="mt-8 space-y-6 anim-fade-in">
            <SectionHeader
              title="Конкретные отзывы"
              subtitle="Подсвечены фрагменты, на которых система построила гипотезу"
            />
            <EvidenceList items={insight.evidenceReviews} />
          </TabsContent>

          {/* --- RISKS & DATA --- */}
          <TabsContent value="risks" className="mt-8 space-y-6 anim-fade-in">
            <div className="grid gap-6 lg:grid-cols-2">
              <RisksList risks={insight.risks} />
              {insight.neededData ? (
                <NeededDataPanel items={insight.neededData} />
              ) : (
                <Card className="flex items-center justify-center p-8 text-xs text-muted-foreground">
                  Дополнительные данные не требуются — гипотеза готова к рассмотрению.
                </Card>
              )}
            </div>
          </TabsContent>

          {/* --- ACTION --- */}
          <TabsContent value="action" className="mt-8 space-y-6 anim-fade-in">
            <OwnerTeamCard
              team={insight.ownerTeam}
              owner={insight.owner.name}
              recommendedAction={insight.recommendedAction}
              taskDescription={insight.taskDescription}
            />

            <Card className="p-6 md:p-7">
              <SectionHeader title="Решение пользователя" subtitle="Зафиксируйте вердикт и передайте в работу" />
              <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Вердикт</p>
                  <div className="stagger grid gap-3">
                    <DecisionButton active={decision === "accept"} onClick={() => setDecision("accept")} icon={Check} title="Принять гипотезу" description="Передать в работу команде" tone="positive" />
                    <DecisionButton active={decision === "reject"} onClick={() => setDecision("reject")} icon={X} title="Отклонить" description="Не подтверждается или не релевантно" tone="negative" />
                    <DecisionButton active={decision === "more_data"} onClick={() => setDecision("more_data")} icon={HelpCircle} title="Нужны дополнительные данные" description="Запросить ещё доказательств" tone="mixed" />
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

          {/* --- IMPACT --- */}
          <TabsContent value="impact" className="mt-8 space-y-6 anim-fade-in">
            {insight.implementationTracking ? (
              <ImpactTracker tracking={insight.implementationTracking} predicted={effectShort} />
            ) : (
              <Card className="p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-base font-semibold">Гипотеза ещё не внедрена</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  После принятия гипотезы и внедрения изменений система автоматически отследит динамику жалоб
                  и сравнит фактический эффект с прогнозом ({effectShort}).
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Related insights footer */}
        <section className="pt-2">
          <SectionHeader title="Связанные гипотезы" subtitle="По той же теме или похожему паттерну" />
          <div className="stagger mt-4 grid gap-3 md:grid-cols-3">
            {INSIGHTS.filter((i) => i.id !== insight.id && i.topicId === insight.topicId).slice(0, 3).map((i) => (
              <Link key={i.id} to="/insights/$insightId" params={{ insightId: i.id }}>
                <Card className="lift group flex items-start gap-3 p-4 hover:border-ai/40">
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

function MetricTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card/80 p-3 shadow-[var(--shadow-elev-1)] backdrop-blur">
      <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
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
