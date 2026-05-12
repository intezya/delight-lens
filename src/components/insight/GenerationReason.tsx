import { Card } from "@/components/ui/card";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function GenerationReason({ reasons }: { reasons: string[] }) {
  return (
    <Card className="motion-surface p-6 md:p-7">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-ai" />
        <h3 className="text-sm font-semibold tracking-tight">Почему гипотеза появилась</h3>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Система предложила её на основании следующих наблюдений:
      </p>
      <ul className="stagger space-y-2.5">
        {reasons.map((r) => (
          <li
            key={r}
            className="motion-row flex items-start gap-2.5 rounded-lg border bg-muted/30 px-3 py-2.5"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ai" />
            <p className="text-sm leading-snug text-foreground/90">{r}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
