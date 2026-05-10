import { Card } from "@/components/ui/card";
import { CheckCircle2, ListChecks, Beaker, Clock, Target as TargetIcon, Users } from "lucide-react";
import type { ValidationPlan } from "@/lib/mock/data";

export function NextSteps({ steps, plan }: { steps: string[]; plan?: ValidationPlan }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card className="p-6 md:p-7">
        <div className="mb-4 flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-ai" />
          <h3 className="text-sm font-semibold tracking-tight">Что делать дальше</h3>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Конкретные шаги, чтобы превратить гипотезу в задачу для команды:
        </p>
        <ol className="stagger space-y-2.5">
          {steps.map((s, idx) => (
            <li key={s} className="flex items-start gap-3 rounded-lg border bg-muted/30 px-3 py-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ai-soft text-[11px] font-semibold text-ai-foreground">
                {idx + 1}
              </span>
              <p className="flex-1 text-sm leading-snug text-foreground/90">{s}</p>
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
            </li>
          ))}
        </ol>
      </Card>

      {plan && (
        <Card className="border-ai/30 bg-ai-soft/20 p-6 md:p-7">
          <div className="mb-4 flex items-center gap-2">
            <Beaker className="h-4 w-4 text-ai" />
            <h3 className="text-sm font-semibold tracking-tight">Как проверить гипотезу</h3>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Минимальный план эксперимента, чтобы подтвердить или опровергнуть гипотезу:
          </p>
          <dl className="space-y-3 text-sm">
            <Row icon={Beaker} label="Формат" value={plan.format} />
            <Row icon={Clock} label="Длительность" value={plan.duration} />
            <Row icon={TargetIcon} label="Метрика успеха" value={plan.metric} />
            <Row icon={Users} label="Команды" value={plan.teams.join(" · ")} />
          </dl>
        </Card>
      )}
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Beaker; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-border/60 pb-2.5 last:border-b-0 last:pb-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex-1">
        <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium leading-snug">{value}</dd>
      </div>
    </div>
  );
}
