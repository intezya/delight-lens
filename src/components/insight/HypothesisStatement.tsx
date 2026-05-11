import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import type { HypothesisStatement } from "@/lib/mock/data";

/**
 * Главный смысловой блок страницы гипотезы — формулировка «Если X, то Y, потому что Z».
 * Размещается сразу под breadcrumbs.
 */
export function HypothesisStatementCard({ statement }: { statement: HypothesisStatement }) {
  return (
    <Card className="anim-rise motion-surface relative overflow-hidden border-ai/40 bg-gradient-to-br from-ai-soft/50 via-card to-card p-7 shadow-[var(--shadow-elev-2)] md:p-10">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-15" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai-soft text-ai-foreground">
            <Lightbulb className="h-4 w-4" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ai-foreground">Гипотеза</p>
        </div>

        <p className="display text-[22px] font-semibold leading-[1.35] tracking-tight md:text-[26px]">
          <span className="text-muted-foreground">Если </span>
          <span className="text-foreground">{statement.ifPart}</span>
          <span className="text-muted-foreground">, то </span>
          <span className="text-foreground">{statement.thenPart}</span>
          <span className="text-muted-foreground">, потому что </span>
          <span className="text-foreground">{statement.becausePart}</span>
          <span className="text-muted-foreground">.</span>
        </p>
      </div>
    </Card>
  );
}
