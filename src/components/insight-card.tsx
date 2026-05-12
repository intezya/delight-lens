import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PriorityBadge, StatusBadge, TopicChip } from "./atoms";
import { InfoHint } from "./info-hint";
import { getTopic, localizeTeam, type Insight } from "@/lib/mock/data";
import {
  ArrowRight,
  GitBranch,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "@tanstack/react-router";

const PROBLEM_LEVEL_META = {
  high: { label: "Подтверждена", cls: "text-positive", Icon: ShieldCheck },
  medium: { label: "Средне", cls: "text-mixed-foreground", Icon: ShieldAlert },
  low: { label: "Слабо", cls: "text-muted-foreground", Icon: ShieldQuestion },
} as const;

export function InsightCard({ insight }: { insight: Insight; compact?: boolean }) {
  const topic = getTopic(insight.topicId);
  const [relativeTime, setRelativeTime] = useState<string>("");
  useEffect(() => {
    setRelativeTime(
      formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true, locale: ru }),
    );
  }, [insight.createdAt]);

  const effect = insight.expectedEffectV2;
  const sign =
    effect.type === "complaints_reduction" || effect.type === "repeat_reduction" ? "−" : "+";
  const effectShort = `${sign}${effect.range.min}–${effect.range.max}${effect.unit}`;
  const altCount = insight.alternatives?.length ?? 0;
  const reviewsCount =
    insight.problemConfidence?.reviewsCount ?? insight.confidenceBreakdown.reviewsCount;

  const pc = insight.problemConfidence;
  const PcIcon = pc ? PROBLEM_LEVEL_META[pc.level].Icon : null;

  return (
    <Link
      to="/insights/$insightId"
      params={{ insightId: insight.id }}
      className="group block focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
    >
      <Card className="lift motion-surface relative flex h-full flex-col gap-3 border bg-card p-4 transition group-hover:border-ai/40 group-hover:shadow-[var(--shadow-elev-2)]">
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

        <div className="grid grid-cols-2 gap-2.5 rounded-lg border bg-muted/30 p-2.5">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Проблема
              <InfoHint text="Подтверждённость самой проблемы — отдельный сигнал от уверенности в причине." />
            </span>
            {pc && PcIcon ? (
              <span
                className={`inline-flex items-center gap-1 text-sm font-semibold ${PROBLEM_LEVEL_META[pc.level].cls}`}
              >
                <PcIcon className="h-3.5 w-3.5" /> {PROBLEM_LEVEL_META[pc.level].label}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Возможный эффект
              <InfoHint text="Прогноз изменения метрики, если одна из гипотез подтвердится. Это диапазон, не точная цифра." />
            </span>
            <p className="num text-sm font-semibold text-ai-foreground">{effectShort}</p>
          </div>
        </div>

        {altCount > 0 && (
          <div className="inline-flex items-center gap-1.5 text-[11px] text-ai-foreground">
            <GitBranch className="h-3 w-3" />
            <span className="font-medium">
              {altCount}{" "}
              {altCount === 1
                ? "возможная причина"
                : altCount < 5
                  ? "возможные причины"
                  : "возможных причин"}
            </span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3 w-3" /> {localizeTeam(insight.ownerTeam)}
          </span>
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {reviewsCount}
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
