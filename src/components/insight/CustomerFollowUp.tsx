import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, AlertCircle, Mail } from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  "Найти контакт клиента в CRM по номеру отзыва",
  "Уточнить номер заказа и дату покупки",
  "Уточнить, что именно было не так",
  "Запросить фото товара или упаковки",
  "Зафиксировать результат расследования в гипотезе",
];

const TEMPLATE = `Здравствуйте!

Мы увидели ваш отзыв и хотим разобраться в ситуации лично.
Подскажите, пожалуйста:

— Номер заказа и дату покупки
— Что именно было не так с товаром
— Если есть возможность — пришлите 1–2 фото

Это поможет нам найти причину проблемы и предотвратить её для других покупателей.
Это не публичный ответ — мы не будем публиковать переписку.

Спасибо, что нашли время написать.`;

/**
 * Сценарий персонального follow-up с клиентом — НЕ автоответ на публичный отзыв.
 * Помогает дособрать данные для гипотезы.
 */
export function CustomerFollowUp() {
  const [text, setText] = useState(TEMPLATE);

  return (
    <Card className="border-ai/30 bg-ai-soft/15 p-5 md:p-6">
      <div className="mb-2 flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-ai" />
        <h3 className="text-sm font-semibold tracking-tight">Связаться с клиентами</h3>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Персональный follow-up помогает понять конкретные кейсы и собрать недостающие данные.
      </p>

      <div className="mb-4 flex items-start gap-2 rounded-md border border-mixed/30 bg-mixed-soft/20 p-2.5 text-[11px] text-mixed-foreground">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>Это не публичный ответ — он не заменяет проверку проблемы и не публикуется на площадке.</span>
      </div>

      <ul className="space-y-1.5">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted/30">
            <Checkbox id={`fu-${i}`} className="mt-0.5" />
            <label htmlFor={`fu-${i}`} className="flex-1 cursor-pointer text-xs leading-snug">{s}</label>
          </li>
        ))}
      </ul>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="mt-4 h-8 w-full text-xs">
            <Mail className="mr-1.5 h-3.5 w-3.5" /> Открыть шаблон сообщения
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Шаблон follow-up клиенту</DialogTitle>
          </DialogHeader>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[260px] text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard?.writeText(text);
                toast.success("Шаблон скопирован — отправьте клиенту через привычный канал.");
              }}
            >
              Скопировать текст
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
