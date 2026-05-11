import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ReviewsSkeleton } from "@/components/skeletons/reviews";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REVIEWS, getTopic, type Review, type Sentiment, type Source } from "@/lib/mock/data";
import { SentimentPill, TopicChip, SignalBar, PriorityBadge, SourceBadge } from "@/components/atoms";
import { ReviewDrawer } from "@/components/review-drawer";
import { LayoutGrid, List, Repeat, Link2, Search, Star } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const Route = createFileRoute("/reviews")({
  pendingComponent: ReviewsSkeleton,
  pendingMs: 120,
  pendingMinMs: 180,
  head: () => ({
    meta: [
      { title: "Reviews — Voicelens" },
      { name: "description", content: "Все распарсенные отзывы с тональностью, темами и AI-разбором." },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const [view, setView] = useState<"table" | "cards">("table");
  const [sentiment, setSentiment] = useState<Sentiment | "all">("all");
  const [source, setSource] = useState<Source | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Review | null>(null);
  const [open, setOpen] = useState(false);
  const [onlyRepeats, setOnlyRepeats] = useState(false);

  const filtered = useMemo(() => REVIEWS.filter(r =>
    (sentiment === "all" || r.sentiment === sentiment) &&
    (source === "all" || r.source === source) &&
    (!onlyRepeats || r.repeatCount > 5) &&
    (!query || r.text.toLowerCase().includes(query.toLowerCase()))
  ), [sentiment, source, query, onlyRepeats]);

  const counts = {
    all: REVIEWS.length,
    pos: REVIEWS.filter(r => r.sentiment === "positive").length,
    neg: REVIEWS.filter(r => r.sentiment === "negative").length,
    mix: REVIEWS.filter(r => r.sentiment === "mixed").length,
  };

  const openReview = (r: Review) => { setSelected(r); setOpen(true); };

  return (
    <AppShell title="Отзывы" subtitle={`${filtered.length} из ${REVIEWS.length} отзывов · фильтры активны`}>
      <div className="motion-page space-y-4 p-4 md:p-6">
        {/* Sentiment tabs counter */}
        <div className="stagger grid grid-cols-2 gap-3 md:grid-cols-4">
          <button onClick={() => setSentiment("all")} className={`motion-surface press rounded-xl border p-3 text-left transition ${sentiment === "all" ? "border-foreground/40 bg-card shadow-[var(--shadow-elev-1)]" : "border-border bg-card hover:bg-muted/40"}`}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Все отзывы</p>
            <p className="num mt-1 display text-2xl font-semibold">{counts.all}</p>
          </button>
          <button onClick={() => setSentiment("positive")} className={`motion-surface press rounded-xl border p-3 text-left transition ${sentiment === "positive" ? "border-positive/50 bg-positive-soft/40" : "border-border bg-card hover:bg-positive-soft/30"}`}>
            <p className="text-[10px] uppercase tracking-wider text-positive-foreground">Позитив</p>
            <p className="num mt-1 display text-2xl font-semibold text-positive-foreground">{counts.pos}</p>
          </button>
          <button onClick={() => setSentiment("mixed")} className={`motion-surface press rounded-xl border p-3 text-left transition ${sentiment === "mixed" ? "border-mixed/50 bg-mixed-soft/40" : "border-border bg-card hover:bg-mixed-soft/30"}`}>
            <p className="text-[10px] uppercase tracking-wider text-mixed-foreground">Смешанный</p>
            <p className="num mt-1 display text-2xl font-semibold text-mixed-foreground">{counts.mix}</p>
          </button>
          <button onClick={() => setSentiment("negative")} className={`motion-surface press rounded-xl border p-3 text-left transition ${sentiment === "negative" ? "border-negative/50 bg-negative-soft/40" : "border-border bg-card hover:bg-negative-soft/30"}`}>
            <p className="text-[10px] uppercase tracking-wider text-negative-foreground">Негатив</p>
            <p className="num mt-1 display text-2xl font-semibold text-negative-foreground">{counts.neg}</p>
          </button>
        </div>

        <Card className="motion-surface overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Поиск по тексту отзыва…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-8 w-[260px] pl-8 text-xs" />
            </div>
            <Select value={source} onValueChange={(v) => setSource(v as any)}>
              <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue placeholder="Источник" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все источники</SelectItem>
                {(["Я.Маркет", "Otzovik", "2GIS", "Google Maps", "Trustpilot", "App Store"] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select defaultValue="topic">
              <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="topic">Группировка: Тема</SelectItem>
                <SelectItem value="sent">Группировка: Тональность</SelectItem>
                <SelectItem value="src">Группировка: Источник</SelectItem>
                <SelectItem value="period">Группировка: Период</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant={onlyRepeats ? "default" : "outline"} onClick={() => setOnlyRepeats(!onlyRepeats)} className="h-8 text-xs">
              <Repeat className="mr-1.5 h-3.5 w-3.5" /> Только повторяющиеся
            </Button>

            <div className="ml-auto">
              <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                <TabsList className="h-8">
                  <TabsTrigger value="table" className="h-7 px-2 text-xs"><List className="mr-1 h-3.5 w-3.5" /> Таблица</TabsTrigger>
                  <TabsTrigger value="cards" className="h-7 px-2 text-xs"><LayoutGrid className="mr-1 h-3.5 w-3.5" /> Карточки</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {view === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Отзыв</th>
                    <th className="px-2 py-2.5 text-left font-medium">Тональность</th>
                    <th className="px-2 py-2.5 text-left font-medium">Темы</th>
                    <th className="px-2 py-2.5 text-left font-medium">Сигнал</th>
                    <th className="px-2 py-2.5 text-left font-medium">Источник</th>
                    <th className="px-2 py-2.5 text-left font-medium">Дата</th>
                    <th className="px-2 py-2.5 text-left font-medium">Приоритет</th>
                    <th className="px-2 py-2.5 text-center font-medium">★</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} onClick={() => openReview(r)} className="motion-row cursor-pointer border-b transition hover:bg-muted/30">
                      <td className="max-w-[420px] px-4 py-3">
                        <div className="flex items-center gap-2">
                          {r.repeatCount > 5 && (
                            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-mixed-soft px-1 py-0.5 text-[9px] font-semibold text-mixed-foreground">
                              <Repeat className="h-2.5 w-2.5" />×{r.repeatCount}
                            </span>
                          )}
                          {r.linkedToKnown && <Link2 className="h-3 w-3 shrink-0 text-ai" />}
                          <span className="line-clamp-1 text-xs">{r.text}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3"><SentimentPill sentiment={r.sentiment} /></td>
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.topics.slice(0, 2).map(t => {
                            const tp = getTopic(t);
                            return tp ? <TopicChip key={t} name={tp.name.length > 14 ? tp.name.slice(0, 14) + "…" : tp.name} kind={tp.kind} /> : null;
                          })}
                        </div>
                      </td>
                      <td className="px-2 py-3"><SignalBar value={r.signal} /></td>
                      <td className="px-2 py-3"><SourceBadge source={r.source} /></td>
                      <td className="px-2 py-3 num text-muted-foreground">{format(new Date(r.date), "d MMM", { locale: ru })}</td>
                      <td className="px-2 py-3"><PriorityBadge priority={r.priority} /></td>
                      <td className="px-2 py-3 text-center"><span className="num inline-flex items-center gap-0.5 text-[11px]">{r.rating}<Star className="h-2.5 w-2.5 fill-mixed text-mixed" /></span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="stagger grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map(r => (
                <button key={r.id} onClick={() => openReview(r)} className="motion-surface press group relative flex flex-col gap-2.5 overflow-hidden rounded-xl border bg-card p-4 text-left shadow-[var(--shadow-elev-1)] transition hover:shadow-[var(--shadow-elev-2)]">
                  <span className={`absolute inset-y-0 left-0 w-1 ${r.sentiment === "positive" ? "bg-positive" : r.sentiment === "negative" ? "bg-negative" : "bg-mixed"}`} />
                  <div className="flex flex-wrap items-center gap-1.5">
                    <SentimentPill sentiment={r.sentiment} />
                    <PriorityBadge priority={r.priority} />
                    {r.repeatCount > 5 && (
                      <span className="inline-flex items-center gap-0.5 rounded-md bg-mixed-soft px-1 py-0.5 text-[10px] font-semibold text-mixed-foreground">
                        <Repeat className="h-2.5 w-2.5" />×{r.repeatCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-snug line-clamp-4">«{r.text}»</p>
                  <div className="mt-auto flex flex-wrap gap-1">
                    {r.topics.slice(0, 3).map(t => {
                      const tp = getTopic(t);
                      return tp ? <TopicChip key={t} name={tp.name} kind={tp.kind} /> : null;
                    })}
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 text-[10px] text-muted-foreground">
                    <SourceBadge source={r.source} />
                    <span className="num">{format(new Date(r.date), "d MMM yyyy", { locale: ru })}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">Ничего не найдено</p>
              <p className="text-xs text-muted-foreground">Попробуйте изменить фильтры или поисковый запрос.</p>
            </div>
          )}
        </Card>
      </div>

      <ReviewDrawer review={selected} open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}
