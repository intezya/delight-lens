import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Tags, Lightbulb, Quote, ShieldCheck, Send } from "lucide-react";

const LS_KEY = "voicelens.onboarding.seen";

const STEPS = [
  { icon: Tags, title: "Откройте тему", text: "Зайдите в раздел «Темы» — там сгруппированы проблемы и возможности, которые AI находит в отзывах." },
  { icon: Lightbulb, title: "Прочитайте гипотезу", text: "Каждая тема содержит гипотезы вида «если..., то..., потому что...» — это конкретное предположение, что нужно изменить." },
  { icon: Quote, title: "Проверьте доказательства", text: "У каждой гипотезы — список реальных отзывов с подсветкой ключевых фрагментов и ссылкой на источник." },
  { icon: ShieldCheck, title: "Оцените уверенность и риски", text: "Уверенность системы показывает, насколько надёжен сигнал. Рядом — что именно может оказаться не так." },
  { icon: Send, title: "Передайте команде", text: "Если гипотеза подтвердилась — нажмите «Передать в работу». Если данных мало — «Нужны данные»." },
] as const;

export function useOnboarding() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(LS_KEY)) setOpen(true);
  }, []);
  const close = () => {
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, "1");
    setOpen(false);
  };
  const reopen = () => setOpen(true);
  return { open, close, reopen };
}

export function OnboardingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-ai-soft/60 px-3 py-1 text-[11px] font-medium text-ai-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Voicelens · добро пожаловать
          </div>
          <DialogTitle className="text-xl leading-tight">
            Платформа находит продуктовые гипотезы в ваших отзывах
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            AI читает отзывы из Я.Маркета, 2GIS, Otzovik и других источников, группирует жалобы и
            предлагает гипотезы для аналитиков и продактов — что можно исправить, чтобы стало лучше.
          </DialogDescription>
        </DialogHeader>

        <ol className="mt-2 space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex items-start gap-3 rounded-lg border bg-muted/30 px-3 py-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ai-soft text-ai-foreground">
                <s.icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground">Шаг {i + 1} · </span>{s.title}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} className="h-9 text-xs">Начать работу</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
