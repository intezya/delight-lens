import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { InsightDetailSkeleton } from "@/components/skeletons/insight-detail";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriorityBadge, SectionHeader, StatusBadge, TopicChip } from "@/components/atoms";
import { InfoHint } from "@/components/info-hint";
import { ProblemConfidenceCard } from "@/components/insight/ProblemConfidenceCard";
import { AlternativeHypotheses } from "@/components/insight/AlternativeHypotheses";
import { WhatToCheck } from "@/components/insight/WhatToCheck";
import { CustomerFollowUp } from "@/components/insight/CustomerFollowUp";
import { ConfidenceBreakdown } from "@/components/insight/ConfidenceBreakdown";
import { ExpectedEffectCard } from "@/components/insight/ExpectedEffectCard";
import { GenerationReason } from "@/components/insight/GenerationReason";
import { EvidenceList } from "@/components/insight/EvidenceList";
import { RisksList } from "@/components/insight/RisksList";
import { NeededDataPanel } from "@/components/insight/NeededDataPanel";
import { ImpactTracker } from "@/components/insight/ImpactTracker";
import { OwnerTeamCard } from "@/components/insight/OwnerTeamCard";
import { StickyActions } from "@/components/insight/StickyActions";
import { INSIGHTS, getInsight, getTopic, getSubtopic, localizeTeam } from "@/lib/mock/data";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  MessageSquareQuote,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export const Route = createFileRoute("/insights/$insightId")({
  pendingComponent: InsightDetailSkeleton,
  pendingMs: 120,
  pendingMinMs: 180,
  head: ({ params }) => ({
    meta: [
      { title: `Гипотеза ${params.insightId} — Voicelens` },
      {
        name: "description",
        content: "Расследование AI-гипотезы: возможные причины, что проверить, доказательства.",
      },
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
        <p className="text-sm text-muted-foreground">
          Такой гипотезы нет.{" "}
          <Link to="/insights" className="underline">
            К списку
          </Link>
        </p>
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

  const alternatives = useMemo(() => insight.alternatives ?? [], [insight.alternatives]);
  const [activeAltId, setActiveAltId] = useState<string>(alternatives[0]?.id ?? "");
  const activeAlt = useMemo(
    () => alternatives.find((a) => a.id === activeAltId) ?? alternatives[0],
    [alternatives, activeAltId],
  );

  const followUpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCreatedAgo(
      formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true, locale: ru }),
    );
  }, [insight.createdAt]);

  return (
    <AppShell
      title={insight.title}
      subtitle={topic ? `Тема · ${topic.name}` : undefined}
      actions={
        <Button asChild size="sm" variant="outline" className="h-8 text-xs">
          <Link to="/insights">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> К списку
          </Link>
        </Button>
      }
    >
      <div className="motion-page mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-4 md:px-6 md:py-6 lg:px-8">
        {/* === MAIN COLUMN === */}
        <div className="min-w-0 space-y-8">
          {/* Breadcrumbs */}
          <nav className="anim-fade-in flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Дашборд
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/insights" className="hover:text-foreground">
              Гипотезы
            </Link>
            <ChevronRight className="h-3 w-3" />
            {topic && (
              <>
                <Link
                  to="/topics/$topicId"
                  params={{ topicId: topic.id }}
                  className="hover:text-foreground"
                >
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
              <StatusBadge status={insight.status} />
              <PriorityBadge priority={insight.priority} />
              {topic && <TopicChip name={topic.name} kind={topic.kind} />}
            </div>
            <h1 className="display text-2xl font-semibold leading-[1.15] tracking-tight sm:text-3xl md:text-[34px]">
              {insight.title}
            </h1>
            <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
              {insight.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5" suppressHydrationWarning>
                <Calendar className="h-3.5 w-3.5" /> Создано {createdAgo}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Период: последние 30 дней
              </span>
            </div>
          </header>

          {/* 1. ПОДТВЕРЖДЁННОСТЬ ПРОБЛЕМЫ — отдельный сигнал */}
          {insight.problemConfidence && (
            <ProblemConfidenceCard confidence={insight.problemConfidence} />
          )}

          {/* 2. ДОКАЗАТЕЛЬСТВА проблемы */}
          <section className="space-y-4">
            <SectionHeader
              title={`Доказательства · ${insight.evidenceReviews.length} отзывов`}
              subtitle="Подсвечены фрагменты, на которых система зафиксировала проблему. Каждый отзыв можно открыть на источнике."
            />
            <EvidenceList items={insight.evidenceReviews} />
          </section>

          {/* 3. ПОЧЕМУ проблема замечена */}
          <section className="space-y-4">
            <SectionHeader
              title="Почему система предложила гипотезу"
              subtitle="На какие наблюдения опирается автоматический анализ"
            />
            <GenerationReason reasons={insight.generationReason} />
          </section>

          {/* 4. АЛЬТЕРНАТИВНЫЕ ВОЗМОЖНЫЕ ПРИЧИНЫ */}
          {alternatives.length > 0 && activeAlt && (
            <section className="space-y-4">
              <SectionHeader
                title={
                  <span className="inline-flex items-center gap-1.5">
                    Возможные причины
                    <InfoHint text="Система разложила проблему на 2–4 версии. Это не «правильный ответ», а варианты для исследования. Каждая требует разных проверок." />
                  </span>
                }
                subtitle="Черновой разбор, а не готовое решение — выберите версию для расследования"
              />
              <AlternativeHypotheses
                alternatives={alternatives}
                activeId={activeAlt.id}
                onSelect={setActiveAltId}
              />

              {/* Активная альтернатива — раскрытие */}
              <div className="grid gap-4 lg:grid-cols-2">
                <WhatToCheck items={activeAlt.whatToCheck} />
                <NeededDataPanel items={activeAlt.missingData} />
              </div>

              {activeAlt.nextActions.length > 0 && (
                <Card className="motion-surface p-5 md:p-6">
                  <h3 className="mb-3 text-sm font-semibold tracking-tight">
                    Следующие исследовательские шаги
                  </h3>
                  <ol className="stagger space-y-2">
                    {activeAlt.nextActions.map((s, idx) => (
                      <li
                        key={s}
                        className="motion-row flex items-start gap-3 rounded-md border bg-muted/30 px-3 py-2.5"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ai-soft text-[11px] font-semibold text-ai-foreground">
                          {idx + 1}
                        </span>
                        <p className="flex-1 text-sm leading-snug">{s}</p>
                      </li>
                    ))}
                  </ol>
                </Card>
              )}
            </section>
          )}

          {/* 5. УВЕРЕННОСТЬ СИСТЕМЫ (в сигнале) */}
          <section className="space-y-4">
            <SectionHeader
              title={
                <span className="inline-flex items-center gap-1.5">
                  Уверенность системы в сигнале
                  <InfoHint text="Насколько надёжен сам сигнал в отзывах. Это НЕ уверенность в конкретной причине — у каждой альтернативной гипотезы выше своя оценка." />
                </span>
              }
              subtitle="Из чего складывается процент"
            />
            <ConfidenceBreakdown
              value={insight.confidence}
              breakdown={insight.confidenceBreakdown}
            />
          </section>

          {/* 6. ОЖИДАЕМЫЙ ЭФФЕКТ */}
          <section className="space-y-4">
            <SectionHeader
              title={
                <span className="inline-flex items-center gap-1.5">
                  Ожидаемый эффект
                  <InfoHint text="Прогноз изменения метрики, если одна из гипотез подтвердится и будет реализована. Это диапазон, а не точная цифра." />
                </span>
              }
              subtitle="Диапазон ожидаемого результата"
            />
            <ExpectedEffectCard effect={insight.expectedEffectV2} />
          </section>

          {/* 7. РИСКИ */}
          <section className="space-y-4">
            <SectionHeader
              title="Риски и ограничения"
              subtitle="Что может уменьшить достоверность гипотезы"
            />
            <RisksList risks={insight.risks} />
          </section>

          {/* 8. FOLLOW-UP с клиентами */}
          <section ref={followUpRef} className="space-y-4 scroll-mt-20">
            <SectionHeader
              title="Связаться с клиентами"
              subtitle="Персональная связь для расследования — не публичный ответ"
            />
            <CustomerFollowUp />
          </section>

          {/* 9. КОМАНДА (если расследование подтвердит причину) */}
          <section className="space-y-4">
            <SectionHeader
              title="Кому передать на следующем шаге"
              subtitle="Команда-владелец, если расследование подтвердит причину"
            />
            <OwnerTeamCard
              team={localizeTeam(insight.ownerTeam)}
              owner={insight.owner.name}
              recommendedAction={insight.recommendedAction}
              taskDescription={insight.taskDescription}
            />
          </section>

          {/* 10. ЭФФЕКТ внедрения (если уже внедрено) */}
          {insight.implementationTracking && (
            <section className="space-y-4">
              <SectionHeader
                title="Фактический эффект"
                subtitle="Сравнение прогноза и реальной динамики после внедрения"
              />
              <ImpactTracker
                tracking={insight.implementationTracking}
                predicted={insight.expectedEffect}
              />
            </section>
          )}

          {/* Связанные гипотезы */}
          <section className="pt-2">
            <SectionHeader title="Связанные гипотезы" subtitle="По той же теме" />
            <div className="stagger mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INSIGHTS.filter((i) => i.id !== insight.id && i.topicId === insight.topicId)
                .slice(0, 3)
                .map((i) => (
                  <Link key={i.id} to="/insights/$insightId" params={{ insightId: i.id }}>
                    <Card className="lift group flex items-start gap-3 p-4 hover:border-ai/40">
                      <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-ai/70" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-xs font-medium">{i.title}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <StatusBadge status={i.status} />
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Card>
                  </Link>
                ))}
              {INSIGHTS.filter((i) => i.id !== insight.id && i.topicId === insight.topicId)
                .length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Других гипотез по этой теме пока нет.
                </p>
              )}
            </div>
          </section>

          <section className="pt-2">
            <StickyActions
              hypothesisStatement={activeAlt?.statement}
              onContact={() =>
                followUpRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            />
          </section>
        </div>
      </div>
    </AppShell>
  );
}
