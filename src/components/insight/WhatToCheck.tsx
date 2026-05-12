import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks } from "lucide-react";

/**
 * Чек-лист «Что проверить перед внедрением» — главный новый блок по фидбеку Yasya.
 * Помогает не «чинить процесс сразу», а сначала исследовать конкретные заказы и кейсы.
 */
export function WhatToCheck({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <Card className="motion-surface border-ai/30 bg-card p-6 md:p-7">
      <div className="mb-2 flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-ai" />
        <h3 className="text-sm font-semibold tracking-tight">Что проверить перед внедрением</h3>
      </div>
      <p className="mb-4 max-w-xl text-xs text-muted-foreground">
        Прежде чем менять процессы, расследуйте конкретные кейсы — отметьте шаги по мере выполнения.
      </p>
      <ul className="stagger space-y-2">
        {items.map((it, i) => (
          <li
            key={it}
            className="motion-row flex items-start gap-3 rounded-lg border bg-muted/20 px-3 py-2.5"
          >
            <Checkbox id={`wtc-${i}`} className="mt-0.5" />
            <label htmlFor={`wtc-${i}`} className="flex-1 cursor-pointer text-sm leading-snug">
              {it}
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}
