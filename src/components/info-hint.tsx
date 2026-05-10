import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Маленькая иконка-подсказка с тултипом. Используется рядом с непонятными метриками.
 *
 *   <InfoHint text="Уверенность системы — насколько надёжен сигнал из отзывов" />
 */
export function InfoHint({ text, className }: { text: string; className?: string }) {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Подсказка"
            className={cn(
              "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 transition hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
              className,
            )}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="start" className="max-w-xs text-[11.5px] leading-snug">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
