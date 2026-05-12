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
  const sign =
    effect.type === "complaints_reduction" || effect.type === "repeat_reduction" ? "−" : "+";
  // Position of midpoint on 0-100 thermometer (using max as scale cap of 50%)
  const cap = effect.unit === "★" ? 1 : 50;
  const midPct = Math.min(100, ((effect.range.min + effect.range.max) / 2 / cap) * 100);
  const minPct = Math.min(100, (effect.range.min / cap) * 100);
  const maxPct = Math.min(100, (effect.range.max / cap) * 100);

  return (
    <Card className="motion-surface p-6 md:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ai-soft text-ai-foreground">
          <Gauge className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Потенциальный эффект
          </p>
          <div className="flex items-baseline gap-2">
            <span className="display num text-4xl font-semibold tabular-nums">
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
          <span>0{effect.unit}</span>
          <span>
            {cap}
            {effect.unit}
          </span>
        </div>
      </div>

      <p className="mt-4 rounded-md border-l-2 border-ai/50 bg-muted/30 px-3 py-2 text-[11px] italic leading-relaxed text-muted-foreground">
        Это диапазон, а не обещание. Оценка основана на частоте темы, динамике роста и доле
        негативных отзывов.
      </p>
    </Card>
  );
}
