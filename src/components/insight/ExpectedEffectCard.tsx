import { Card } from "@/components/ui/card";
import { Gauge } from "lucide-react";
import type { ExpectedEffect } from "@/lib/mock/data";

const LABEL_TONE: Record<ExpectedEffect["label"], string> = {
  низкий: "bg-muted text-muted-foreground",
  средний: "bg-mixed-soft text-mixed-foreground",
  "средний-высокий": "bg-ai-soft text-ai-foreground",
  высокий: "bg-positive-soft text-positive-foreground",
};

export function ExpectedEffectCard({ effect }: { effect: ExpectedEffect }) {
  const isReduction = effect.type === "complaints_reduction" || effect.type === "repeat_reduction";
  const sign = isReduction ? "−" : "+";
  const cap = effect.unit === "★" ? 1 : 50;
  const minPct = isReduction
    ? Math.max(0, ((cap - effect.range.max) / cap) * 100)
    : Math.min(100, (effect.range.min / cap) * 100);
  const maxPct = isReduction
    ? Math.min(100, ((cap - effect.range.min) / cap) * 100)
    : Math.min(100, (effect.range.max / cap) * 100);
  const midPct = (minPct + maxPct) / 2;
  const leftScaleLabel = isReduction ? `−${cap}${effect.unit}` : `0${effect.unit}`;
  const rightScaleLabel = isReduction ? `0${effect.unit}` : `+${cap}${effect.unit}`;

  return (
    <Card className="motion-surface p-4 sm:p-6 md:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ai-soft text-ai-foreground">
          <Gauge className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Потенциальный эффект
          </p>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="display num text-3xl font-semibold tabular-nums sm:text-4xl">
              {sign}
              {effect.range.min}–{effect.range.max}
              {effect.unit}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${LABEL_TONE[effect.label]}`}
            >
              {effect.label}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
            {effect.reason}
          </p>
        </div>
      </div>

      {/* Thermometer */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>{isReduction ? "Снижение метрики" : "Рост метрики"}</span>
          <span>{isReduction ? "Без изменений" : "Максимум шкалы"}</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-ai/60 to-ai transition-[left,width] duration-500"
            style={{ left: `${minPct}%`, width: `${Math.max(2, maxPct - minPct)}%` }}
          />
          <div
            className="absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
            style={{ left: `${midPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground num">
          <span>{leftScaleLabel}</span>
          <span>{rightScaleLabel}</span>
        </div>
      </div>

      <p className="mt-4 rounded-md border-l-2 border-ai/50 bg-muted/30 px-3 py-2 text-[11px] italic leading-relaxed text-muted-foreground">
        Это диапазон, а не обещание. Оценка основана на частоте темы, динамике роста и доле
        негативных отзывов.
      </p>
    </Card>
  );
}
