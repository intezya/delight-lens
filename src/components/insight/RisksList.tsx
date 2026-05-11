import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function RisksList({ risks }: { risks: string[] }) {
  if (!risks?.length) return null;
  return (
    <Card className="motion-surface border-amber-300/60 bg-amber-50/60 p-6 dark:border-amber-500/20 dark:bg-amber-500/5 md:p-7">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <h3 className="text-sm font-semibold tracking-tight">Что может быть не так</h3>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Система признаёт ограничения этой гипотезы — учтите их при принятии решения:
      </p>
      <ul className="stagger space-y-2">
        {risks.map((r) => (
          <li key={r} className="motion-row flex items-start gap-2.5 text-sm leading-snug text-foreground/90">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            {r}
          </li>
        ))}
      </ul>
    </Card>
  );
}
