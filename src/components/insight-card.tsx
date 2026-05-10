import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ConfidenceBar, PriorityBadge, StatusBadge, TopicChip } from "./atoms";
import { InfoHint } from "./info-hint";
import { getTopic, localizeTeam, type Insight } from "@/lib/mock/data";
import { ArrowRight, MessageSquare, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "@tanstack/react-router";

export function InsightCard({ insight }: { insight: Insight; compact?: boolean }) {
  const topic = getTopic(insight.topicId);
  const [relativeTime, setRelativeTime] = useState<string>("");
  useEffect(() => {
    setRelativeTime(formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true, locale: ru }));
  }, [insight.createdAt]);

  const effect = insight.expectedEffectV2;
  const sign = effect.type === "complaints_reduction" || effect.type === "repeat_reduction" ? "−" : "+";
  const effectShort = `${sign}${effect.range.min}–${effect.range.max}${effect.unit}`;

  return (
    <Link
      to="/insights/$insightId"
      params={{ insightId: insight.id }}
      className="group block focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
    >
      <Card className="lift relative flex h-full flex-col gap-3 border bg-card p-4 transition group-hover:border-ai/40 group-hover:shadow-[var(--shadow-elev-2)]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={insight.status} />
            <PriorityBadge priority={insight.priority} />
          </div>
          <span className="text-[10px] text-muted-foreground" suppressHydrationWarning>
            {relativeTime}
          </span>
        </div>

        <h4 className="text-[15px] font-semibold leading-snug tracking-tight transition-colors group-hover:text-ai">
          {insight.title}
        </h4>

        {topic && (
          <div>
            <TopicChip name={topic.name} kind={topic.kind} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-2.5">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Уверенность системы
              <InfoHint text="Насколько надёжен сигнал — рассчитывается на основе количества отзывов, повторяемости, разнообразия источников и свежести." />
            </span>
            <ConfidenceBar value={insight.confidence} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Ожидаемый эффект
              <InfoHint text="Прогнозируемое изменение метрики, если гипотеза будет реализована. Оценка системы на основе частоты и динамики проблемы." />
            </span>
            <p className="num text-sm font-semibold text-ai-foreground">{effectShort}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3 w-3" /> {localizeTeam(insight.ownerTeam)}
          </span>
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {insight.confidenceBreakdown.reviewsCount}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-foreground transition group-hover:text-ai">
              Открыть <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </span>
          </span>
        </div>
      </Card>
    </Link>
  );
}
