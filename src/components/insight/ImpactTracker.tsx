import { Card } from "@/components/ui/card";
import { TrendingDown, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { ImplementationTracking } from "@/lib/mock/data";

export function ImpactTracker({
  tracking,
  predicted,
}: {
  tracking: ImplementationTracking;
  predicted?: string;
}) {
  const drop = Math.round(
    ((tracking.before.complaintsPerWeek - tracking.after.complaintsPerWeek) /
      Math.max(1, tracking.before.complaintsPerWeek)) *
      100,
  );
  const data = Array.from({ length: 12 }).map((_, i) => {
    const t = i / 11;
    const v =
      tracking.before.complaintsPerWeek -
      (tracking.before.complaintsPerWeek - tracking.after.complaintsPerWeek) * t;
    return { i, v: Math.round(v + Math.sin(i) * 1.5) };
  });
  return (
    <Card className="motion-surface overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-positive-soft/30 px-6 py-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-positive" />
          <p className="text-sm font-semibold">
            Гипотеза внедрена ·{" "}
            {format(new Date(tracking.implementedAt), "d MMMM yyyy", { locale: ru })}
          </p>
        </div>
        <span className="num inline-flex items-center gap-1 rounded-md bg-positive px-2 py-1 text-[11px] font-semibold text-white">
          <TrendingDown className="h-3 w-3" /> Факт {tracking.actualEffect}
        </span>
      </div>
      <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
        <div className="grid grid-cols-2 gap-0 border-b md:border-b-0 md:border-r">
          <Stat label="Жалоб в неделю · до" value={tracking.before.complaintsPerWeek} />
          <Stat
            label="Жалоб в неделю · после"
            value={tracking.after.complaintsPerWeek}
            positive
            last
          />
          <Stat label="Доля негатива · до" value={`${tracking.before.negativeShare}%`} last />
          <Stat
            label="Доля негатива · после"
            value={`${tracking.after.negativeShare}%`}
            positive
            last
          />
        </div>
        <div className="p-5">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            Динамика жалоб
          </p>
          <div className="motion-chart h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="impact-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--positive)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--positive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--positive)"
                  strokeWidth={2}
                  fill="url(#impact-grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">
              Прогноз: <span className="font-medium text-foreground">{predicted ?? "—"}</span>
            </span>
            <span className="text-muted-foreground">
              Факт: <span className="font-semibold text-positive">−{drop}%</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  positive,
  last,
}: {
  label: string;
  value: number | string;
  positive?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`p-5 ${last ? "" : "border-b"}`}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`display num mt-1 text-2xl font-semibold tabular-nums ${positive ? "text-positive" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}
