import { Card } from "@/components/ui/card";
import { ExternalLink, Quote } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { SentimentPill, SourceBadge } from "@/components/atoms";
import { getReview, type EvidenceReview } from "@/lib/mock/data";
import { splitHighlight } from "@/lib/utils";

export function EvidenceList({ items }: { items: EvidenceReview[] }) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">Доказательства не выделены.</p>;
  }
  return (
    <div className="stagger grid gap-4 md:grid-cols-2">
      {items.map((ev) => {
        const r = getReview(ev.reviewId);
        if (!r) return null;
        const split = splitHighlight(r.text, ev.highlight);
        return (
          <Card
            key={ev.reviewId}
            className="lift flex flex-col gap-3 border p-5 hover:border-ai/40"
          >
            <div className="flex items-start gap-2.5">
              <Quote className="mt-1 h-4 w-4 shrink-0 text-ai/60" />
              <p className="text-sm leading-relaxed text-foreground">
                «
                {split ? (
                  <>
                    {split.before}
                    <mark className="rounded bg-ai-soft px-1 py-0.5 font-medium text-ai-foreground">
                      {split.match}
                    </mark>
                    {split.after}
                  </>
                ) : (
                  r.text
                )}
                »
              </p>
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-2 border-t pt-3 text-[11px]">
              <SentimentPill sentiment={r.sentiment} />
              <SourceBadge source={r.source} />
              <span className="text-muted-foreground">
                · {format(new Date(r.date), "d MMM yyyy", { locale: ru })}
              </span>
              <span className="text-muted-foreground">· {r.author}</span>
              <a
                href={r.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1 rounded-md border bg-card px-2 py-1 text-[10.5px] font-medium text-foreground transition hover:border-ai/40 hover:text-ai sm:ml-auto sm:w-auto"
              >
                <ExternalLink className="h-3 w-3" />
                Открыть на {r.source}
              </a>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
