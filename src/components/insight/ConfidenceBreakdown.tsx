import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { ConfidenceBreakdown as CB } from "@/lib/mock/data";

const COLORS = ["bg-ai", "bg-positive", "bg-mixed", "bg-negative", "bg-foreground/40"];

export function ConfidenceBreakdown({ value, breakdown }: { value: number; breakdown: CB }) {
  const total = breakdown.factors.reduce((s, f) => s + f.score, 0) || 1;
  return (
    <Card className="motion-surface p-6 md:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ai-soft text-ai-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Уверенность системы
          </p>
          <div className="flex items-baseline gap-2">
            <span className="display num text-4xl font-semibold tabular-nums">{value}%</span>
            <span className="text-xs text-muted-foreground">
              на основе {breakdown.reviewsCount} отзывов
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
            Оценка собрана из {breakdown.factors.length} факторов: объёма данных, повторяемости,
            тональности, разнообразия источников и свежести сигнала.
          </p>
        </div>
      </div>

      {/* Stacked breakdown bar */}
      <div className="mt-6 flex h-3 overflow-hidden rounded-full">
        {breakdown.factors.map((f, i) => (
          <div
            key={f.label}
            className={`${COLORS[i % COLORS.length]} transition-[width] duration-700`}
            style={{ width: `${(f.score / total) * 100}%` }}
            title={`${f.label}: ${f.score}`}
          />
        ))}
      </div>

      <ul className="stagger mt-5 grid gap-3 sm:grid-cols-2">
        {breakdown.factors.map((f, i) => (
          <li
            key={f.label}
            className="motion-row flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3"
          >
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${COLORS[i % COLORS.length]}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold">{f.label}</p>
                <span className="num text-[11px] font-medium tabular-nums text-muted-foreground">
                  +{f.score}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
