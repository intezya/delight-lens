import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AiBadge,
  PriorityBadge,
  SectionHeader,
  StatusBadge,
  TopicChip,
} from "@/components/atoms";
import { InfoHint } from "@/components/info-hint";
import { HypothesisStatementCard } from "@/components/insight/HypothesisStatement";
import { ConfidenceBreakdown } from "@/components/insight/ConfidenceBreakdown";
import { ExpectedEffectCard } from "@/components/insight/ExpectedEffectCard";
import { GenerationReason } from "@/components/insight/GenerationReason";
import { EvidenceList } from "@/components/insight/EvidenceList";
import { RisksList } from "@/components/insight/RisksList";
import { NeededDataPanel } from "@/components/insight/NeededDataPanel";
import { ImpactTracker } from "@/components/insight/ImpactTracker";
import { OwnerTeamCard } from "@/components/insight/OwnerTeamCard";
import { NextSteps } from "@/components/insight/NextSteps";
import { StickyActions } from "@/components/insight/StickyActions";
import {
  INSIGHTS,
  getInsight,
  getTopic,
  getSubtopic,
  localizeTeam,
} from "@/lib/mock/data";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  MessageSquareQuote,
  Users,
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
      <div className="mx-auto grid max-w-[1280px] gap-8 p-4 md:p-8 lg:grid-cols-[1fr_320px] lg:p-10">
        {/* === MAIN COLUMN === */}
        <div className="min-w-0 space-y-8">
          {/* Breadcrumbs */}
          <nav className="anim-fade-in flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Дашборд</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/insights" className="hover:text-foreground">Гипотезы</Link>
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

          {/* Заголовок проблемы */}
          <header className="anim-rise space-y-3">
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
                <span className="font-medium text-foreground">{localizeTeam(insight.ownerTeam)}</span>
                · {insight.owner.name}
              </span>
              <span className="inline-flex items-center gap-1.5" suppressHydrationWarning>
                <Calendar className="h-3.5 w-3.5" /> Создано {createdAgo}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Период: последние 30 дней
              </span>
            </div>
          </header>

          {/* 1. ГИПОТЕЗА — главный блок */}
          {insight.hypothesisStatement && (
            <HypothesisStatementCard statement={insight.hypothesisStatement} />
          )}

          {/* 2. Почему система её предложила */}
          <section className="space-y-4">
            <SectionHeader title="Почему система предложила гипотезу" subtitle="На какие наблюдения опирается AI-анализ" />
            <GenerationReason reasons={insight.generationReason} />
          </section>

          {/* 3. Доказательства */}
          <section className="space-y-4">
            <SectionHeader
              title={`Доказательства · ${insight.evidenceReviews.length} отзывов`}
              subtitle="Подсвечены фрагменты, на которых система построила гипотезу. Каждый отзыв можно открыть на источнике."
            />
            <EvidenceList items={insight.evidenceReviews} />
          </section>

          {/* 4. Метрики и уверенность */}
          <section className="space-y-4">
            <SectionHeader
              title={
                <span className="inline-flex items-center gap-1.5">
                  Уверенность системы
                  <InfoHint text="Сколько баллов из 100 даёт каждый фактор. Сумма формирует общий процент уверенности — он показывает, насколько надёжен сигнал в отзывах." />
                </span>
              }
              subtitle="Из чего складывается процент уверенности AI"
            />
            <ConfidenceBreakdown value={insight.confidence} breakdown={insight.confidenceBreakdown} />
          </section>

          {/* 5. Ожидаемый эффект */}
          <section className="space-y-4">
            <SectionHeader
              title={
                <span className="inline-flex items-center gap-1.5">
                  Ожидаемый эффект
                  <InfoHint text="Прогнозируемое изменение метрики, если гипотеза будет реализована. Оценка системы на основе частоты проблемы, динамики и похожих кейсов." />
                </span>
              }
              subtitle="Диапазон, в котором AI ожидает результат"
            />
            <ExpectedEffectCard effect={insight.expectedEffectV2} />
          </section>

          {/* 6. Риски и недостающие данные */}
          <section className="grid gap-6 lg:grid-cols-2">
            <RisksList risks={insight.risks} />
            {insight.neededData && <NeededDataPanel items={insight.neededData} />}
          </section>

          {/* 7. Что делать дальше */}
          {insight.nextSteps && (
            <section className="space-y-4">
              <SectionHeader title="Что делать дальше" subtitle="Конкретные шаги и план проверки гипотезы" />
              <NextSteps steps={insight.nextSteps} plan={insight.validationPlan} />
            </section>
          )}

          {/* 8. Команда-владелец */}
          <section className="space-y-4">
            <SectionHeader title="Кому передать" subtitle="Команда-владелец и описание задачи" />
            <OwnerTeamCard
              team={localizeTeam(insight.ownerTeam)}
              owner={insight.owner.name}
              recommendedAction={insight.recommendedAction}
              taskDescription={insight.taskDescription}
            />
          </section>

          {/* 9. Эффект внедрения (если уже внедрено) */}
          {insight.implementationTracking && (
            <section className="space-y-4">
              <SectionHeader title="Фактический эффект" subtitle="Сравнение прогноза и реальной динамики после внедрения" />
              <ImpactTracker
                tracking={insight.implementationTracking}
                predicted={insight.expectedEffect}
              />
            </section>
          )}

          {/* Связанные гипотезы */}
          <section className="pt-2">
            <SectionHeader title="Связанные гипотезы" subtitle="По той же теме" />
            <div className="stagger mt-4 grid gap-3 md:grid-cols-3">
              {INSIGHTS.filter((i) => i.id !== insight.id && i.topicId === insight.topicId).slice(0, 3).map((i) => (
                <Link key={i.id} to="/insights/$insightId" params={{ insightId: i.id }}>
                  <Card className="lift group flex items-start gap-3 p-4 hover:border-ai/40">
                    <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-ai/70" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{i.title}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <StatusBadge status={i.status} />
                        <span className="num text-[10px] text-muted-foreground">{i.confidence}%</span>
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

        {/* === STICKY ACTIONS === */}
        <aside className="lg:block">
          <StickyActions defaultDecision={insight.status === "needs_data" ? "needs_data" : null} />
        </aside>
      </div>
    </AppShell>
  );
}
