import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CauseHypothesis } from "@/lib/mock/data";

/**
 * Переключатель альтернативных причин. Показывает: AI не «знает ответ»,
 * а предлагает 2–4 версии — выбор в руках пользователя.
 */
export function AlternativeHypotheses({
  alternatives,
  activeId,
  onSelect,
}: {
  alternatives: CauseHypothesis[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="motion-surface p-5 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-ai" />
          <h3 className="text-sm font-semibold tracking-tight">
            Возможные причины · {alternatives.length}
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Выберите версию для расследования
        </span>
      </div>
      <p className="mb-4 max-w-2xl text-xs text-muted-foreground">
        AI не выбирает за вас — он раскладывает проблему на несколько правдоподобных версий.
        Каждая требует разных проверок и данных.
      </p>

      <div className="stagger grid gap-2.5 md:grid-cols-2">
        {alternatives.map((a, idx) => {
          const active = a.id === activeId;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(a.id)}
              className={cn(
                "lift motion-surface press group flex flex-col gap-2 rounded-lg border p-3.5 text-left transition",
                active
                  ? "border-ai bg-ai-soft/40 shadow-[var(--shadow-elev-1)]"
                  : "border-border bg-card hover:border-ai/40 hover:bg-ai-soft/15",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                    active ? "bg-ai text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {active ? <Check className="h-3 w-3" /> : idx + 1}
                </span>
                <span className="num text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Гипотеза {idx + 1} · уверенность {a.confidenceLabel}
                </span>
              </div>
              <p className="text-sm leading-snug">{a.statement}</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-ai/70 transition-[width] duration-500"
                    style={{ width: `${a.solutionConfidence}%` }}
                  />
                </div>
                <span className="num text-[10px] tabular-nums text-muted-foreground">
                  {a.solutionConfidence}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
