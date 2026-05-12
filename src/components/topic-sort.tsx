import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export type TopicSortKey = "neg_growth" | "reviews_count" | "criticality" | "freshness";

const LABELS: Record<TopicSortKey, string> = {
  neg_growth: "Рост негатива",
  reviews_count: "Количество отзывов",
  criticality: "Критичность",
  freshness: "Свежесть",
};

export function TopicSort({
  value,
  onChange,
}: {
  value: TopicSortKey;
  onChange: (v: TopicSortKey) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Сортировка</span>
      <Select value={value} onValueChange={(v) => onChange(v as TopicSortKey)}>
        <SelectTrigger className="h-8 w-[180px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(LABELS) as TopicSortKey[]).map((k) => (
            <SelectItem key={k} value={k} className="text-xs">
              {LABELS[k]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
