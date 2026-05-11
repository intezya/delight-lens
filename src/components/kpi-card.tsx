import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Delta } from "./atoms";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  delta?: number;
  invertDelta?: boolean;
  deltaSuffix?: string;
  spark?: number[];
  tone?: "neutral" | "positive" | "negative" | "ai";
  suffix?: string;
};

export function KpiCard({ label, value, hint, delta, invertDelta, deltaSuffix, spark, tone = "neutral", suffix }: Props) {
  const toneCls = {
    neutral: "from-transparent to-transparent",
    positive: "from-positive/10 to-transparent",
    negative: "from-negative/10 to-transparent",
    ai: "from-ai/10 to-transparent",
  }[tone];
  const sparkColor = tone === "positive" ? "var(--positive)" : tone === "negative" ? "var(--negative)" : tone === "ai" ? "var(--ai)" : "var(--muted-foreground)";

  return (
    <Card className={cn("motion-surface relative overflow-hidden border bg-card p-4 shadow-[var(--shadow-elev-1)] transition hover:shadow-[var(--shadow-elev-2)]")}>
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", toneCls)} />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          {hint && (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/60 hover:text-muted-foreground">
                    <Info className="h-3 w-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[220px] text-[11px]">{hint}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="num display text-3xl font-semibold tracking-tight">{value}</span>
            {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
          </div>
          {delta !== undefined && <Delta value={delta} invert={invertDelta} suffix={deltaSuffix ?? "%"} />}
        </div>
        {spark && spark.length > 0 && (
          <div className="-mb-1 -mx-1 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark.map((v, i) => ({ i, v }))}>
                <defs>
                  <linearGradient id={`spk-${label}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={sparkColor} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area dataKey="v" type="monotone" stroke={sparkColor} strokeWidth={1.5} fill={`url(#spk-${label})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
