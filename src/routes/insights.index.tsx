import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { InsightsSkeleton } from "@/components/skeletons/insights";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { INSIGHTS, type InsightStatus } from "@/lib/mock/data";
import { InsightCard } from "@/components/insight-card";
import { LayoutGrid, Columns3 } from "lucide-react";
import { AiBadge } from "@/components/atoms";

export const Route = createFileRoute("/insights/")({
  pendingComponent: InsightsSkeleton,
  pendingMs: 120,
  pendingMinMs: 180,
  head: () => ({
    meta: [
      { title: "AI Insights — Voicelens" },
      { name: "description", content: "AI-сгенерированные гипотезы для продактов и аналитиков." },
    ],
  }),
  component: InsightsPage,
});

const STATUSES: { key: InsightStatus | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "new", label: "Новые" },
  { key: "validated", label: "Подтверждены" },
  { key: "in_progress", label: "В работе" },
  { key: "implemented", label: "Внедрены" },
  { key: "rejected", label: "Отклонены" },
];

const KANBAN_LABELS: Record<InsightStatus, string> = {
  new: "Новые",
  validated: "Подтверждены",
  in_progress: "В работе",
  implemented: "Внедрены",
  rejected: "Отклонены",
  needs_data: "Нужны данные",
};

function InsightsPage() {
  const [status, setStatus] = useState<InsightStatus | "all">("all");
  const [layout, setLayout] = useState<"grid" | "kanban">("grid");

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s.key] =
      s.key === "all" ? INSIGHTS.length : INSIGHTS.filter((i) => i.status === s.key).length;
    return acc;
  }, {});

  const filtered = status === "all" ? INSIGHTS : INSIGHTS.filter((i) => i.status === status);

  return (
    <AppShell
      title="Гипотезы AI"
      subtitle={`${INSIGHTS.length} активных гипотез · сгенерированы AI на основе ваших отзывов`}
    >
      <div className="motion-page mx-auto w-full max-w-[1440px] space-y-4 px-3 py-4 sm:px-4 md:px-6">
        <Card className="motion-surface relative overflow-hidden border-ai/30 bg-gradient-to-br from-ai-soft/60 via-card to-card p-5">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="mb-2 flex items-center gap-2">
                <AiBadge />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Сводка периода
                </span>
              </div>
              <h2 className="display text-xl font-semibold tracking-tight sm:text-2xl">
                AI выделил {INSIGHTS.filter((i) => i.signal > 70).length} сильных гипотез из 1 792
                отзывов
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Принятие в работу всех «critical» гипотез ожидаемо снизит долю негатива на 22% в
                течение 4 недель.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 md:w-auto">
              <div className="rounded-lg border bg-card px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Средняя уверенность
                </p>
                <p className="num display text-2xl font-semibold">
                  {Math.round(INSIGHTS.reduce((s, i) => s + i.confidence, 0) / INSIGHTS.length)}%
                </p>
              </div>
              <div className="rounded-lg border bg-card px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  В работе
                </p>
                <p className="num display text-2xl font-semibold">{counts.in_progress}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="-mx-3 overflow-x-auto px-3 sm:-mx-4 sm:px-4 lg:mx-0 lg:px-0">
            <Tabs value={status} onValueChange={(v) => setStatus(v as InsightStatus | "all")}>
              <TabsList className="h-9 w-max">
                {STATUSES.map((s) => (
                  <TabsTrigger key={s.key} value={s.key} className="h-8 gap-1.5 text-xs">
                    {s.label}
                    <span className="num rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
                      {counts[s.key]}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="w-full sm:w-auto lg:ml-auto">
            <Tabs value={layout} onValueChange={(v) => setLayout(v as "grid" | "kanban")}>
              <TabsList className="h-9 w-full">
                <TabsTrigger value="grid" className="h-8 flex-1 px-2 text-xs sm:flex-none">
                  <LayoutGrid className="mr-1 h-3.5 w-3.5" /> Сетка
                </TabsTrigger>
                <TabsTrigger value="kanban" className="h-8 flex-1 px-2 text-xs sm:flex-none">
                  <Columns3 className="mr-1 h-3.5 w-3.5" /> Канбан
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {layout === "grid" ? (
          <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((i) => (
              <InsightCard key={i.id} insight={i} />
            ))}
          </div>
        ) : (
          <div className="-mx-3 overflow-x-auto px-3 pb-2 sm:-mx-4 sm:px-4 md:-mx-6 md:px-6">
            <div className="flex min-w-max gap-4">
              {(["new", "validated", "in_progress", "implemented", "rejected"] as const).map(
                (col) => (
                  <div
                    key={col}
                    className="motion-surface flex w-[min(320px,calc(100vw-2rem))] shrink-0 flex-col gap-3 rounded-xl border bg-muted/20 p-3"
                  >
                    <div className="sticky top-0 flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider">
                        {KANBAN_LABELS[col]}
                      </h4>
                      <span className="num rounded bg-card px-1.5 text-[10px] font-medium">
                        {counts[col]}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {INSIGHTS.filter((i) => i.status === col).map((i) => (
                        <InsightCard key={i.id} insight={i} compact />
                      ))}
                      {counts[col] === 0 && (
                        <p className="rounded-lg border border-dashed py-6 text-center text-[11px] text-muted-foreground">
                          пусто
                        </p>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
