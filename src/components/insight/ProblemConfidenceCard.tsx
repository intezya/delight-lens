import { Card } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, ShieldQuestion, MessageSquare } from "lucide-react";
import { InfoHint } from "@/components/info-hint";
import type { ProblemConfidence } from "@/lib/mock/data";

const meta: Record<ProblemConfidence["level"], { label: string; cls: string; tone: string; Icon: typeof ShieldCheck }> = {
  high: { label: "Высокая", cls: "text-positive", tone: "border-positive/40 bg-positive-soft/30", Icon: ShieldCheck },
  medium: { label: "Средняя", cls: "text-mixed-foreground", tone: "border-mixed/40 bg-mixed-soft/30", Icon: ShieldAlert },
  low: { label: "Низкая", cls: "text-muted-foreground", tone: "border-border bg-muted/30", Icon: ShieldQuestion },
};

/**
 * Подтверждённость проблемы — отдельный сигнал от уверенности в причине.
 * Показывает, насколько отзывы устойчиво указывают, что проблема существует.
 */
export function ProblemConfidenceCard({ confidence }: { confidence: ProblemConfidence }) {
  const m = meta[confidence.level];
  const Icon = m.Icon;
  return (
    <Card className={`anim-rise flex items-start gap-4 border p-5 ${m.tone}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background/60 ${m.cls}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Проблема подтверждена
          </p>
          <InfoHint text="Насколько отзывы убедительно указывают, что проблема реально существует. Это отдельный сигнал от уверенности в конкретной причине." />
        </div>
        <p className="mt-1 text-lg font-semibold tracking-tight">
          <span className={m.cls}>{m.label}</span>
          <span className="ml-2 num text-sm font-medium text-muted-foreground">
            <MessageSquare className="mr-1 inline h-3.5 w-3.5" />
            {confidence.reviewsCount} отзывов
          </span>
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{confidence.description}</p>
      </div>
    </Card>
  );
}
