import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { TOPIC_DISTRIBUTION, INSIGHTS, getSubtopicsByTopic } from "@/lib/mock/data";
import { TopicChip, StatusBadge, AiBadge } from "@/components/atoms";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowRight, AlertOctagon, Lightbulb, Sparkle, Quote, Sparkles } from "lucide-react";

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
      <div className="space-y-8 p-4 md:p-6 max-w-[1400px] mx-auto">
        {(["risk", "opportunity", "strength"] as const).map(kind => {
          const meta = sectionMeta[kind];
          const Icon = meta.icon;
          return (
            <section key={kind}>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h3 className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight">
                    <Icon className="h-4 w-4" style={{ color: meta.color }} /> {meta.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{meta.subtitle} · {grouped[kind].length} тем</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {grouped[kind].map((t, idx) => {
                  const total = t.total;
                  const negShare = total ? (t.negative / total) * 100 : 0;
                  const posShare = total ? (t.positive / total) * 100 : 0;
                  const mixShare = total ? (t.mixed / total) * 100 : 0;
                  const topicInsights = INSIGHTS.filter(i => i.topicId === t.id);
                  return (
                    <Card
                      key={t.id}
                      className="group flex flex-col gap-4 p-5 shadow-[var(--shadow-elev-1)] transition hover:border-foreground/30 hover:shadow-[var(--shadow-elev-2)]"
                    >
                      <Link to="/topics/$topicId" params={{ topicId: t.id }} className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <TopicChip name={t.kind === "risk" ? "Risk" : t.kind === "strength" ? "Strength" : "Opportunity"} kind={t.kind} />
                            <span className="text-[10px] text-muted-foreground num">{total} отзывов</span>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-muted-foreground opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                        </div>
                        <h4 className="text-base font-semibold leading-snug tracking-tight">{t.name}</h4>
                        <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                          <div className="h-12 -mx-1">
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
                          <div className="text-right text-[11px] num">
                            <span className="text-positive">+{t.positive}</span> · <span className="text-negative">−{t.negative}</span>
                          </div>
                        </div>
                        <div className="flex h-1.5 overflow-hidden rounded-full">
                          <div className="bg-positive" style={{ width: `${posShare}%` }} />
                          <div className="bg-mixed" style={{ width: `${mixShare}%` }} />
                          <div className="bg-negative" style={{ width: `${negShare}%` }} />
                        </div>
                      </Link>

                      {topicInsights.length > 0 && (
                        <div className="border-t pt-3">
                          <div className="mb-2 flex items-center gap-1.5">
                            <AiBadge />
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              {topicInsights.length} {topicInsights.length === 1 ? "гипотеза" : "гипотез"}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {topicInsights.slice(0, 2).map(ins => (
                              <Link
                                key={ins.id}
                                to="/insights/$insightId"
                                params={{ insightId: ins.id }}
                                className="flex items-center gap-2 rounded-md border bg-muted/20 px-2.5 py-1.5 text-xs transition hover:border-ai/40 hover:bg-ai-soft/30"
                              >
                                <Sparkles className="h-3 w-3 shrink-0 text-ai" />
                                <span className="line-clamp-1 flex-1">{ins.title}</span>
                                <StatusBadge status={ins.status} />
                              </Link>
                            ))}
                            {topicInsights.length > 2 && (
                              <Link
                                to="/topics/$topicId"
                                params={{ topicId: t.id }}
                                className="block text-[11px] text-muted-foreground hover:text-foreground pl-1"
                              >
                                +{topicInsights.length - 2} ещё →
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
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
