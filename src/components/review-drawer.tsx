import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { type Review, getTopic, REVIEWS, INSIGHTS } from "@/lib/mock/data";
import { SentimentPill, SourceBadge, TopicChip, SignalBar, PriorityBadge, AiBadge } from "./atoms";
import { Button } from "@/components/ui/button";
import { Star, Repeat, Link2, Sparkles, Quote, Flag } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function ReviewDrawer({ review, open, onOpenChange }: { review: Review | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!review) return null;
  const similar = REVIEWS.filter(r => r.id !== review.id && r.topics.some(t => review.topics.includes(t))).slice(0, 4);
  const relatedInsights = INSIGHTS.filter(i => review.topics.includes(i.topicId)).slice(0, 3);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[560px]">
        <SheetHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <SentimentPill sentiment={review.sentiment} size="md" />
            <PriorityBadge priority={review.priority} />
            {review.linkedToKnown && (
              <span className="inline-flex items-center gap-1 rounded-md border border-ai/30 bg-ai-soft/40 px-1.5 py-0.5 text-[10px] font-medium text-ai-foreground">
                <Link2 className="h-3 w-3" /> Связан с известной проблемой
              </span>
            )}
            {review.repeatCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-mixed-soft px-1.5 py-0.5 text-[10px] font-medium text-mixed-foreground">
                <Repeat className="h-3 w-3" /> повтор ×{review.repeatCount}
              </span>
            )}
          </div>
          <SheetTitle className="leading-snug">Отзыв {review.id}</SheetTitle>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <SourceBadge source={review.source} />
            <span>·</span>
            <span>{format(new Date(review.date), "d MMM yyyy", { locale: ru })}</span>
            <span>·</span>
            <span>{review.author}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5 num">
              {review.rating}<Star className="h-3 w-3 fill-mixed text-mixed" />
            </span>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <blockquote className="relative rounded-xl border-l-2 border-foreground/30 bg-muted/40 p-4 pl-6">
            <Quote className="absolute left-2 top-3 h-3 w-3 text-muted-foreground/50" />
            <p className="text-sm leading-relaxed">{review.text}</p>
          </blockquote>

          <section>
            <div className="mb-2 flex items-center gap-2">
              <AiBadge />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Разбор AI</h4>
            </div>
            <div className="space-y-3 rounded-xl border bg-card p-3.5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Темы</span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {review.topics.map((t) => {
                    const topic = getTopic(t);
                    return topic ? <TopicChip key={t} name={topic.name} kind={topic.kind} /> : null;
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t pt-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Сила сигнала</span>
                  <div className="mt-1.5"><SignalBar value={review.signal} /></div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Сегмент</span>
                  <p className="mt-1.5 text-xs">{review.region} · {review.category}</p>
                </div>
              </div>
              <div className="border-t pt-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Эмоции</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(review.sentiment === "negative" ? ["разочарование", "недоверие", "злость"] : review.sentiment === "positive" ? ["удовлетворение", "доверие"] : ["амбивалентность"]).map((e) => (
                    <span key={e} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{e}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {relatedInsights.length > 0 && (
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Связанные AI-инсайты</h4>
              <div className="space-y-2">
                {relatedInsights.map((i) => (
                  <div key={i.id} className="flex items-start gap-2 rounded-lg border border-ai/20 bg-ai-soft/30 p-2.5">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ai" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{i.title}</p>
                      <p className="num text-[10px] text-muted-foreground">confidence {i.confidence}% · {i.expectedEffect}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {similar.length > 0 && (
            <section>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Похожие отзывы</h4>
              <div className="space-y-2">
                {similar.map((r) => (
                  <div key={r.id} className="rounded-lg border bg-card p-2.5">
                    <div className="mb-1 flex items-center gap-1.5">
                      <SentimentPill sentiment={r.sentiment} />
                      <SourceBadge source={r.source} />
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t pt-4">
            <Button size="sm" className="h-8 text-xs"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> Создать гипотезу</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs"><Flag className="mr-1.5 h-3.5 w-3.5" /> В работу</Button>
            <Button size="sm" variant="ghost" className="ml-auto h-8 text-xs">Скрыть</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
