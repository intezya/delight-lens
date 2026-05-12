import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Beaker, Clock, Target, Users, FileSearch } from "lucide-react";
import { toast } from "sonner";

export function InvestigationPlanDialog({
  open,
  onOpenChange,
  hypothesis,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  hypothesis: string;
}) {
  const steps = [
    {
      icon: FileSearch,
      title: "Шаг 1 · Сбор данных",
      text: "Выгрузить заказы клиентов из 14 жалоб, проверить SKU и пути товаров на складе.",
    },
    {
      icon: Users,
      title: "Шаг 2 · Интервью",
      text: "Связаться с 5 клиентами и 2 менеджерами, чтобы услышать обе стороны.",
    },
    {
      icon: Beaker,
      title: "Шаг 3 · Локальный пилот",
      text: "Запустить мини-эксперимент в 3 точках — фотофиксация состояния товара перед отгрузкой.",
    },
    {
      icon: Target,
      title: "Шаг 4 · Метрика",
      text: "Через 2 недели сравнить долю жалоб «витринный» в пилотных точках с базовой группой.",
    },
    {
      icon: Clock,
      title: "Шаг 5 · Решение",
      text: "Если в пилоте −20% жалоб — масштабировать. Иначе — вернуться к альтернативным гипотезам.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">План исследования гипотезы</DialogTitle>
          <DialogDescription className="text-sm">«{hypothesis}»</DialogDescription>
        </DialogHeader>

        <ol className="space-y-2.5">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={i} className="flex items-start gap-3 rounded-lg border bg-card p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ai-soft text-ai-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-snug">{s.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
          <Button
            size="sm"
            onClick={() => {
              toast.success("План сохранён в гипотезе. Команда получит уведомление.");
              onOpenChange(false);
            }}
          >
            Сохранить план
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
