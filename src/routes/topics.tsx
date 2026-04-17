import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { TOPIC_DISTRIBUTION } from "@/lib/mock/data";
import { TopicChip, SectionHeader } from "@/components/atoms";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowRight, AlertOctagon, Lightbulb, Sparkle } from "lucide-react";

export const Route = createFileRoute("/topics")({
  head: () => ({
    meta: [
      { title: "Topics — Voicelens" },
      { name: "description", content: "Все темы отзывов: риски, возможности и сильные стороны." },
    ],
  }),
  component: TopicsPage,
});

function genSpark(seed: number) {
  return Array.from({ length: 20 }).map((_, i) => ({ i, v: 10 + Math.sin((i + seed) / 3) * 5 + (i / 4) * (seed % 3 === 0 ? 1 : -0.5) + Math.random() * 3 }));
}

function TopicsPage() {
  const grouped = {
    risk: TOPIC_DISTRIBUTION.filter(t => t.kind === "risk"),
    opportunity: TOPIC_DISTRIBUTION.filter(t => t.kind === "opportunity"),
    strength: TOPIC_DISTRIBUTION.filter(t => t.kind === "strength"),
  };

  const sectionMeta = {
    risk: { title: "Риски и проблемы", subtitle: "Темы, требующие действий", icon: AlertOctagon, color: "var(--negative)" },
    opportunity: { title: "Возможности", subtitle: "Зоны роста и улучшений", icon: Lightbulb, color: "var(--ai)" },
    strength: { title: "Сильные стороны", subtitle: "Что нравится клиентам", icon: Sparkle, color: "var(--positive)" },
  } as const;

  return (
    <AppShell title="Темы" subtitle={`${TOPIC_DISTRIBUTION.length} тем за период · автоматическая классификация AI`}>
      <div className="space-y-6 p-4 md:p-6">
        {(["risk", "opportunity", "strength"] as const).map(kind => {
          const meta = sectionMeta[kind];
          const Icon = meta.icon;
          return (
            <section key={kind}>
              <SectionHeader
                title={
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: meta.color }} /> {meta.title}
                  </span> as unknown as string
                }
                subtitle={`${meta.subtitle} · ${grouped[kind].length} тем`}
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {grouped[kind].map((t, idx) => {
                  const total = t.total;
                  const negShare = total ? (t.negative / total) * 100 : 0;
                  const posShare = total ? (t.positive / total) * 100 : 0;
                  const mixShare = total ? (t.mixed / total) * 100 : 0;
                  return (
                    <Link
                      to="/topics/$topicId"
                      params={{ topicId: t.id }}
                      key={t.id}
                      className="group flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-[var(--shadow-elev-1)] transition hover:border-foreground/30 hover:shadow-[var(--shadow-elev-2)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <TopicChip name={t.kind === "risk" ? "Risk" : t.kind === "strength" ? "Strength" : "Opportunity"} kind={t.kind} />
                        <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-muted-foreground opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                      </div>
                      <h4 className="text-sm font-semibold leading-snug">{t.name}</h4>
                      <div className="h-10 -mx-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={genSpark(idx + kind.length)}>
                            <defs>
                              <linearGradient id={`tg-${t.id}`} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor={meta.color} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={meta.color} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area dataKey="v" stroke={meta.color} strokeWidth={1.5} fill={`url(#tg-${t.id})`} type="monotone" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex h-1.5 overflow-hidden rounded-full">
                        <div className="bg-positive" style={{ width: `${posShare}%` }} />
                        <div className="bg-mixed" style={{ width: `${mixShare}%` }} />
                        <div className="bg-negative" style={{ width: `${negShare}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="num text-muted-foreground">{total} отзывов</span>
                        <span className="num font-medium">
                          <span className="text-positive">+{t.positive}</span> · <span className="text-negative">−{t.negative}</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
                {grouped[kind].length === 0 && (
                  <Card className="flex items-center justify-center p-8 text-xs text-muted-foreground">Нет тем в этой группе</Card>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
