import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, HelpCircle, Send } from "lucide-react";
import { InfoHint } from "@/components/info-hint";
import { useState } from "react";
import { toast } from "sonner";

type Decision = "accept" | "needs_data" | "reject" | null;

/**
 * Sticky-панель действий по гипотезе. Не смешивается с табами —
 * только три ключевых исхода + фиксация решения.
 */
export function StickyActions({ defaultDecision }: { defaultDecision?: Decision }) {
  const [decision, setDecision] = useState<Decision>(defaultDecision ?? null);

  const handleSubmit = () => {
    if (!decision) return;
    const map: Record<NonNullable<Decision>, string> = {
      accept: "Гипотеза передана команде. Мы оповестим ответственного.",
      needs_data: "Запрос данных создан — система соберёт недостающую информацию и вернётся.",
      reject: "Гипотеза отклонена. Решение зафиксировано в истории.",
    };
    toast.success(map[decision]);
  };

  return (
    <Card className="sticky top-16 space-y-4 p-5 shadow-[var(--shadow-elev-2)]">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">Решение по гипотезе</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Зафиксируйте, что делать с гипотезой — это сохранится в её истории.
        </p>
      </div>

      <div className="space-y-2">
        <ActionButton
          active={decision === "accept"}
          onClick={() => setDecision("accept")}
          icon={Check}
          tone="positive"
          title="Передать в работу"
          hint="Гипотеза будет передана команде-владельцу. Будет создана задача с описанием и доказательствами."
        />
        <ActionButton
          active={decision === "needs_data"}
          onClick={() => setDecision("needs_data")}
          icon={HelpCircle}
          tone="mixed"
          title="Нужны данные"
          hint="Система пометит гипотезу как требующую дополнительных данных и подскажет, чего именно не хватает."
        />
        <ActionButton
          active={decision === "reject"}
          onClick={() => setDecision("reject")}
          icon={X}
          tone="negative"
          title="Отклонить"
          hint="Гипотеза будет скрыта из активного списка. Сохранится в архиве с указанием причины."
        />
      </div>

      <Button size="sm" disabled={!decision} onClick={handleSubmit} className="press w-full h-9 text-xs">
        <Send className="mr-1.5 h-3.5 w-3.5" /> Зафиксировать решение
      </Button>
    </Card>
  );
}

function ActionButton({
  active,
  onClick,
  icon: Icon,
  tone,
  title,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Check;
  tone: "positive" | "negative" | "mixed";
  title: string;
  hint: string;
}) {
  const activeCls = {
    positive: "border-positive bg-positive-soft/60",
    negative: "border-negative bg-negative-soft/60",
    mixed: "border-mixed bg-mixed-soft/60",
  }[tone];
  const iconCls = {
    positive: "text-positive bg-positive-soft",
    negative: "text-negative bg-negative-soft",
    mixed: "text-mixed-foreground bg-mixed-soft",
  }[tone];
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-2.5 transition ${active ? activeCls : "border-border bg-card hover:border-foreground/20"}`}
    >
      <button type="button" onClick={onClick} className="flex flex-1 items-center gap-3 text-left">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${iconCls}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-medium">{title}</span>
      </button>
      <InfoHint text={hint} />
    </div>
  );
}
