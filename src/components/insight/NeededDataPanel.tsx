import { Card } from "@/components/ui/card";
import { Database, HelpCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export function NeededDataPanel({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <Card className="motion-surface border-ai/30 bg-ai-soft/30 p-6 md:p-7">
      <div className="mb-2 flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-ai" />
        <h3 className="text-sm font-semibold tracking-tight">Нужны дополнительные данные</h3>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Система считает гипотезу перспективной, но для передачи в работу не хватает следующих
        данных:
      </p>
      <ul className="stagger space-y-2">
        {items.map((it, i) => (
          <li
            key={it}
            className="motion-row flex items-start gap-2.5 rounded-md border bg-card/80 px-3 py-2.5"
          >
            <Checkbox id={`need-${i}`} className="mt-0.5" />
            <label htmlFor={`need-${i}`} className="flex-1 cursor-pointer text-sm leading-snug">
              <Database className="mr-1.5 inline h-3.5 w-3.5 text-muted-foreground" />
              {it}
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}
