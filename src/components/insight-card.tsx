import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AiBadge, ConfidenceBar, ImpactIcon, PriorityBadge, SignalBar, StatusBadge, TopicChip } from "./atoms";
import { getTopic, type Insight } from "@/lib/mock/data";
import { Check, X, ArrowRight, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function InsightCard({ insight, compact }: { insight: Insight; compact?: boolean }) {
  const topic = getTopic(insight.topicId);
  return (
    <Card className="group flex flex-col gap-3 border bg-card p-4 shadow-[var(--shadow-elev-1)] transition hover:border-ai/40 hover:shadow-[var(--shadow-elev-2)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <AiBadge />
          <StatusBadge status={insight.status} />
          <PriorityBadge priority={insight.priority} />
        </div>
        <span className="text-[10px] text-muted-foreground">
          {formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true, locale: ru })}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-semibold leading-snug tracking-tight">{insight.title}</h4>
        {!compact && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">{insight.description}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {topic && <TopicChip name={topic.name} kind={topic.kind} />}
        <ImpactIcon impact={insight.impact} />
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</span>
          <ConfidenceBar value={insight.confidence} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Сила сигнала</span>
          <SignalBar value={insight.signal} />
        </div>
      </div>

      <div className="rounded-lg border-l-2 border-ai bg-ai-soft/40 px-2.5 py-1.5">
        <span className="text-[10px] uppercase tracking-wider text-ai-foreground/80">Ожидаемый эффект</span>
        <p className="mt-0.5 num text-xs font-medium text-ai-foreground">{insight.expectedEffect}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[9px] font-semibold">
            {insight.owner.name.split(" ").map(s => s[0]).join("")}
          </span>
          <span className="font-medium text-foreground">{insight.owner.name}</span>
          <span className="text-muted-foreground">· {insight.owner.team}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <MessageSquare className="h-3 w-3" /> {insight.reviewIds.length}
        </span>
      </div>

      {!compact && (
        <div className="-mb-1 flex flex-wrap items-center gap-1.5">
          <Button size="sm" className="h-7 text-[11px]"><Check className="mr-1 h-3 w-3" /> Принять</Button>
          <Button size="sm" variant="outline" className="h-7 text-[11px]"><X className="mr-1 h-3 w-3" /> Отклонить</Button>
          <Button size="sm" variant="ghost" className="ml-auto h-7 text-[11px]">Детали <ArrowRight className="ml-1 h-3 w-3" /></Button>
        </div>
      )}
    </Card>
  );
}
