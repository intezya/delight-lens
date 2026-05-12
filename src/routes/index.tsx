import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DashboardSkeleton } from "@/components/skeletons/dashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPI, REVIEWS, INSIGHTS, ANOMALIES, getTopic } from "@/lib/mock/data";
import { SectionHeader, Delta, TopicChip } from "@/components/atoms";
import { PeriodToggle, periodLabel, type Period } from "@/components/period-toggle";
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Repeat,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useState, type ElementType } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  pendingComponent: DashboardSkeleton,
  pendingMs: 120,
  pendingMinMs: 180,
  head: () => ({
    meta: [
      { title: "Дашборд" },
      {
        name: "description",
        content: "Аналитика клиентских отзывов: тональность, темы, гипотезы и эффект изменений.",
      },
    ],
  }),
  component: DashboardPage,
});

// ──────────────────────────────────────────────────────────────────────────
// Hero: AI brief

function AiBrief({ period, onChange }: { period: Period; onChange: (p: Period) => void }) {
  const headline = INSIGHTS.find((i) => i.id === "i-2")!;
  const title =
    period === "24h"
      ? "Утренний брифинг · последние 24 часа"
      : period === "7d"
        ? "Сводка за 7 дней"
        : "Сводка за 30 дней";
  const body =
    period === "24h" ? (
      <>
        За сутки система зафиксировала <span className="text-negative">+12 новых жалоб</span> на
        доставку и <span className="text-ai">1 новую гипотезу</span>.
      </>
    ) : period === "7d" ? (
      <>
        За неделю негатив по доставке вырос на <span className="text-negative">+18%</span>, готовы{" "}
        <span className="text-ai">2 новые гипотезы</span> к проверке.
      </>
    ) : (
      <>
        За 30 дней негатив по доставке вырос на <span className="text-negative">+42%</span>, готовы{" "}
        <span className="text-ai">3 новые гипотезы</span> к работе.
      </>
    );
  return (
    <Card className="motion-surface relative overflow-hidden border-ai/20 bg-gradient-to-br from-ai-soft/40 via-card to-card p-5 shadow-[var(--shadow-elev-2)]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-ai/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-2.5">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
          </div>
          <h2 className="text-xl font-semibold leading-snug tracking-tight md:text-2xl">{body}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Главное событие — кластер задержек по выходным. Сильные стороны бренда устойчиво растут
            — упоминания программы лояльности. Рекомендуем начать с гипотезы по логистике —
            расследовать причины переноса слотов.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 lg:items-end">
          <PeriodToggle value={period} onChange={onChange} />
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
    {
      label: "Индекс тональности",
      value: KPI.sentimentIndex,
      suffix: "/100",
      delta: KPI.sentimentDelta,
      tone: KPI.sentimentIndex >= 0 ? "positive" : "negative",
    },
    {
      label: "Гипотезы в действия",
      value: KPI.conversion,
      suffix: "%",
      delta: KPI.conversionDelta,
      tone: "ai",
    },
    {
      label: "Приоритетных гипотез",
      value: KPI.strongInsightsInWork,
      suffix: "",
      delta: 4,
      tone: "neutral",
    },
    {
      label: "Тональность после внедрений",
      value: `+${KPI.sentimentAfter}`,
      suffix: "",
      delta: 6,
      tone: "positive",
    },
  ] as const;
  return (
    <Card className="motion-surface grid grid-cols-2 divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col gap-1 p-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {it.label}
          </span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="display num text-2xl font-semibold tracking-tight">
              {it.value}
              {it.suffix && (
                <span className="ml-0.5 text-sm font-medium text-muted-foreground">
                  {it.suffix}
                </span>
              )}
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
    id: "att-1",
    severity: "critical",
    kind: "anomaly",
    title: "Резкий рост жалоб на сроки доставки",
    reason: "Система заметила всплеск +142% за 7 дней. Связан с гипотезой о слотах выходного дня.",
    metric: "+142%",
    insightId: "i-2",
    topicId: "delay",
    reviewCount: 17,
  },
  {
    id: "att-2",
    severity: "critical",
    kind: "insight",
    title: "Витринный товар продаётся как новый",
    reason: "14 повторов за 30 дней, концентрация в Москве и СПб. Гипотеза валидирована.",
    metric: "сигнал 88",
    insightId: "i-1",
    topicId: "defective",
    reviewCount: 14,
  },
  {
    id: "att-3",
    severity: "high",
    kind: "repeat",
    title: "Гарантия: SLA нарушен в 38% обращений",
    reason: "Однотипный сценарий «обещают перезвонить — не перезванивают». Среднее 9 дней.",
    metric: "13 повторов",
    insightId: "i-4",
    topicId: "warranty",
    reviewCount: 13,
  },
  {
    id: "att-4",
    severity: "medium",
    kind: "growth",
    title: "Программа лояльности — главный источник позитива",
    reason: "76 упоминаний с 5★. Возможность конвертировать в NPS-кампанию.",
    metric: "+34%",
    insightId: "i-3",
    topicId: "loyalty-bonus",
    reviewCount: 76,
  },
  {
    id: "att-5",
    severity: "high",
    kind: "anomaly",
    title: "Подозрение на серый канал в категории Аудио",
    reason: "Новый кластер «серийник не пробивается» — 9 отзывов, уверенность 71%.",
    metric: "новый кластер",
    insightId: "i-7",
    topicId: "fake",
    reviewCount: 9,
  },
];

function AttentionCard({ item }: { item: AttentionItem }) {
  const [open, setOpen] = useState(false);
  const Icon =
    item.kind === "anomaly"
      ? AlertTriangle
      : item.kind === "repeat"
        ? Repeat
        : item.kind === "growth"
          ? TrendingUp
          : Sparkles;
  const sevTone =
    item.severity === "critical"
      ? "border-l-negative bg-negative-soft/20"
      : item.severity === "high"
        ? "border-l-mixed bg-mixed-soft/15"
        : "border-l-ai bg-ai-soft/15";
  const iconCls =
    item.severity === "critical"
      ? "text-negative"
      : item.severity === "high"
        ? "text-mixed"
        : "text-ai";

  const TitleWrap: ElementType = item.insightId ? Link : "div";
  const titleProps = item.insightId
    ? {
        to: "/insights/$insightId",
        params: { insightId: item.insightId },
        className: "block min-w-0 flex-1 space-y-1 hover:[&_h4]:text-ai",
      }
    : { className: "block min-w-0 flex-1 space-y-1" };

  return (
    <div
      className={cn(
        "motion-surface group rounded-lg border border-l-[3px] bg-card transition hover:shadow-[var(--shadow-elev-1)]",
        sevTone,
      )}
    >
      <div className="flex w-full items-start gap-3 p-3.5 text-left">
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconCls)} />
        <TitleWrap {...titleProps}>
          <div className="flex items-center justify-between gap-3">
            <h4 className="truncate text-sm font-medium transition-colors">{item.title}</h4>
            <span className="num shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
              {item.metric}
            </span>
          </div>
          <p className="line-clamp-1 text-[11.5px] leading-relaxed text-muted-foreground">
            {item.reason}
          </p>
          <div className="flex items-center gap-3 pt-0.5 text-[10.5px] text-muted-foreground">
            {item.topicId && (
              <TopicChip
                name={getTopic(item.topicId)?.name ?? ""}
                kind={getTopic(item.topicId)?.kind}
              />
            )}
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {item.reviewCount} отзывов
            </span>
          </div>
        </TitleWrap>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Свернуть" : "Развернуть действия"}
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="motion-expand flex flex-wrap items-center gap-2 border-t bg-background/40 px-3.5 py-2.5">
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
              <Link to="/topics/$topicId" params={{ topicId: item.topicId }}>
                Тема
              </Link>
            </Button>
          )}
          <span className="ml-auto text-[10px] text-muted-foreground">
            Замечено системой · {new Date().toLocaleDateString("ru-RU")}
          </span>
        </div>
      )}
    </div>
  );
}

function AttentionFeed() {
  return (
    <Card className="motion-surface p-4">
      <SectionHeader
        title="Требует вашего внимания"
        subtitle="Приоритизированные сигналы · 5 пунктов"
        action={
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
            <Link to="/insights">
              Все гипотезы <ChevronRight className="ml-0.5 h-3 w-3" />
            </Link>
          </Button>
        }
      />
      <div className="stagger space-y-2">
        {ATTENTION.map((it) => (
          <AttentionCard key={it.id} item={it} />
        ))}
      </div>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Page

function DashboardPage() {
  const newCount = INSIGHTS.filter((i) => i.status === "new").length;
  const repeatCount = REVIEWS.filter((r) => r.repeatCount > 5).length;
  const [period, setPeriod] = useState<Period>("24h");

  return (
    <AppShell
      subtitle={`Система заметила ${ANOMALIES.length} новых сигналов · ${newCount} новых гипотез · ${repeatCount} повторов`}
      actions={
        <Button asChild size="sm" className="h-8 text-xs">
          <Link to="/insights">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Перейти к гипотезам
          </Link>
        </Button>
      }
    >
      <div className="motion-page space-y-5 p-4 md:p-6">
        <AiBrief period={period} onChange={setPeriod} />

        <HealthStrip />

        <AttentionFeed />

        <Card className="motion-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">
                Эффект внедрённых решений вынесен на отдельную вкладку
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Этот экран показывает только то, что требует внимания {periodLabel(period)}.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <Link to="/impact">
                Открыть «Эффект» <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
