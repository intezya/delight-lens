import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FileSearch, Database, Users, X, Send } from "lucide-react";
import { InfoHint } from "@/components/info-hint";
import { toast } from "sonner";
import { InvestigationPlanDialog } from "./InvestigationPlanDialog";

type Action = "investigate" | "plan" | "request_data" | "contact" | "reject" | null;

const ACTIONS: {
  id: Exclude<Action, null>;
  title: string;
  icon: typeof Search;
  tone: "ai" | "mixed" | "negative";
  hint: string;
}[] = [
  {
    id: "investigate",
    title: "Начать проверку",
    icon: Search,
    tone: "ai",
    hint: "Гипотеза переходит в статус «расследование». Команде придёт чек-лист «Что проверить» и список нужных данных.",
  },
  {
    id: "plan",
    title: "Сформировать план исследования",
    icon: FileSearch,
    tone: "ai",
    hint: "Система составит пошаговый план проверки гипотезы — выгрузка данных, интервью, локальный пилот, метрика, решение.",
  },
  {
    id: "request_data",
    title: "Запросить данные",
    icon: Database,
    tone: "mixed",
    hint: "Создаст запрос к нужной системе или команде на основе блока «Каких данных не хватает».",
  },
  {
    id: "contact",
    title: "Связаться с клиентами",
    icon: Users,
    tone: "mixed",
    hint: "Откроет персональный сценарий связи — это не публичный ответ, а способ уточнить детали с клиентами из жалоб.",
  },
  {
    id: "reject",
    title: "Отклонить как нерелевантную",
    icon: X,
    tone: "negative",
    hint: "Гипотеза будет скрыта из активного списка с причиной отклонения. Сохранится в архиве.",
  },
];

/**
 * Sticky-панель с исследовательскими действиями (а не «внедрить»).
 * По фидбеку Yasya: основные CTA — расследовать и проверить, не сразу менять процессы.
 */
export function StickyActions({
  hypothesisStatement,
  onContact,
}: {
  hypothesisStatement?: string;
  onContact?: () => void;
}) {
  const [active, setActive] = useState<Action>(null);
  const [planOpen, setPlanOpen] = useState(false);

  const handleSubmit = () => {
    if (!active) return;
    if (active === "plan") {
      setPlanOpen(true);
      return;
    }
    const map: Record<Exclude<Action, null>, string> = {
      investigate: "Запущена проверка. Чек-лист передан владельцу гипотезы.",
      plan: "",
      request_data: "Запрос данных создан — ответственные команды получат уведомление.",
      contact: "Открыт сценарий follow-up с клиентом.",
      reject: "Гипотеза отклонена. Решение сохранено в истории.",
    };
    if (active === "contact" && onContact) onContact();
    toast.success(map[active]);
  };

  return (
    <>
      <Card className="space-y-4 p-4 shadow-[var(--shadow-elev-1)] sm:p-5">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Что сделать с гипотезой</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Гипотеза — это <b className="text-foreground">старт расследования</b>, а не готовое
            решение. Выберите следующий исследовательский шаг.
          </p>
        </div>

        <div className="stagger space-y-1.5">
          {ACTIONS.map((a) => (
            <ActionRow key={a.id} {...a} active={active === a.id} onClick={() => setActive(a.id)} />
          ))}
        </div>

        <Button
          size="sm"
          disabled={!active}
          onClick={handleSubmit}
          className="press w-full h-9 text-xs"
        >
          <Send className="mr-1.5 h-3.5 w-3.5" /> Подтвердить действие
        </Button>
      </Card>

      <InvestigationPlanDialog
        open={planOpen}
        onOpenChange={setPlanOpen}
        hypothesis={hypothesisStatement ?? "выбранная гипотеза"}
      />
    </>
  );
}

function ActionRow({
  active,
  onClick,
  icon: Icon,
  tone,
  title,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Search;
  tone: "ai" | "mixed" | "negative";
  title: string;
  hint: string;
}) {
  const activeCls = {
    ai: "border-ai bg-ai-soft/50",
    mixed: "border-mixed bg-mixed-soft/50",
    negative: "border-negative bg-negative-soft/40",
  }[tone];
  const iconCls = {
    ai: "text-ai bg-ai-soft",
    mixed: "text-mixed-foreground bg-mixed-soft",
    negative: "text-negative bg-negative-soft",
  }[tone];
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border p-2.5 transition sm:gap-2.5 ${active ? activeCls : "border-border bg-card hover:border-foreground/20"}`}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 items-center gap-2.5 text-left transition-transform active:scale-[0.99]"
      >
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${iconCls}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[12.5px] font-medium leading-tight sm:text-[13px]">{title}</span>
      </button>
      <InfoHint text={hint} />
    </div>
  );
}
