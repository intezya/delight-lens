import { cn } from "@/lib/utils";
import type { Sentiment, TopicKind, Priority, InsightStatus, InsightImpact } from "@/lib/mock/data";
import { ArrowDown, ArrowUp, Minus, Repeat, Star, TrendingDown, TrendingUp, Target, ThumbsUp } from "lucide-react";

export function SentimentPill({ sentiment, size = "sm" }: { sentiment: Sentiment; size?: "sm" | "md" }) {
  const cls =
    sentiment === "positive"
      ? "bg-positive-soft text-positive-foreground"
      : sentiment === "negative"
        ? "bg-negative-soft text-negative-foreground"
        : "bg-mixed-soft text-mixed-foreground";
  const label = sentiment === "positive" ? "Позитив" : sentiment === "negative" ? "Негатив" : "Смешанный";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        cls,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          sentiment === "positive" ? "bg-positive" : sentiment === "negative" ? "bg-negative" : "bg-mixed",
        )}
      />
      {label}
    </span>
  );
}

export function TopicChip({ name, kind, count }: { name: string; kind?: TopicKind; count?: number }) {
  const cls =
    kind === "risk"
      ? "border-negative/30 bg-negative-soft/60 text-negative-foreground"
      : kind === "strength"
        ? "border-positive/30 bg-positive-soft/60 text-positive-foreground"
        : kind === "opportunity"
          ? "border-ai/30 bg-ai-soft/60 text-ai-foreground"
          : "border-border bg-muted text-foreground";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium", cls)}>
      {name}
      {count !== undefined && <span className="opacity-60">·{count}</span>}
    </span>
  );
}

export function SignalBar({ value, className }: { value: number; className?: string }) {
  const tone = value >= 75 ? "bg-negative" : value >= 50 ? "bg-mixed" : "bg-positive";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="relative h-1 w-16 overflow-hidden rounded-full bg-muted">
        <div className={cn("absolute inset-y-0 left-0 rounded-full", tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="num text-[10px] tabular-nums text-muted-foreground">{value}</span>
    </div>
  );
}

export function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--ai)] to-[color-mix(in_oklab,var(--ai)_60%,white)]" style={{ width: `${value}%` }} />
      </div>
      <span className="num text-[11px] font-medium tabular-nums text-foreground">{value}%</span>
    </div>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { label: string; cls: string }> = {
    critical: { label: "Критичный", cls: "bg-negative text-white" },
    high: { label: "Высокий", cls: "bg-negative-soft text-negative-foreground" },
    medium: { label: "Средний", cls: "bg-mixed-soft text-mixed-foreground" },
    low: { label: "Низкий", cls: "bg-muted text-muted-foreground" },
  };
  const m = map[priority];
  return <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-medium", m.cls)}>{m.label}</span>;
}

export function StatusBadge({ status }: { status: InsightStatus }) {
  const map: Record<InsightStatus, { label: string; cls: string }> = {
    new: { label: "Новая", cls: "bg-ai-soft text-ai-foreground" },
    validated: { label: "Подтверждена", cls: "bg-positive-soft text-positive-foreground" },
    in_progress: { label: "В работе", cls: "bg-mixed-soft text-mixed-foreground" },
    implemented: { label: "Внедрена", cls: "bg-positive text-white" },
    rejected: { label: "Отклонена", cls: "bg-muted text-muted-foreground line-through" },
    needs_data: { label: "Нужны данные", cls: "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200" },
  };
  const m = map[status];
  return <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-medium", m.cls)}>{m.label}</span>;
}

export function ImpactIcon({ impact, className }: { impact: InsightImpact; className?: string }) {
  const map: Record<InsightImpact, { Icon: typeof ArrowDown; label: string; cls: string }> = {
    down_neg: { Icon: TrendingDown, label: "Снижение негатива", cls: "text-negative" },
    up_pos: { Icon: TrendingUp, label: "Рост позитива", cls: "text-positive" },
    down_repeat: { Icon: Repeat, label: "Снижение повторяемости", cls: "text-mixed" },
    up_sat: { Icon: ThumbsUp, label: "Рост удовлетворённости", cls: "text-positive" },
    up_rating: { Icon: Star, label: "Рост рейтинга", cls: "text-ai" },
  };
  const m = map[impact];
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium", m.cls, className)}>
      <m.Icon className="h-3.5 w-3.5" /> {m.label}
    </span>
  );
}

export function Delta({ value, suffix = "%", invert = false }: { value: number; suffix?: string; invert?: boolean }) {
  const positive = invert ? value < 0 : value > 0;
  const neutral = value === 0;
  const Icon = neutral ? Minus : positive ? ArrowUp : ArrowDown;
  const cls = neutral ? "text-muted-foreground" : positive ? "text-positive" : "text-negative";
  return (
    <span className={cn("inline-flex items-center gap-0.5 num text-[11px] font-medium tabular-nums", cls)}>
      <Icon className="h-3 w-3" />
      {Math.abs(value)}
      {suffix}
    </span>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SourceBadge({ source }: { source: string }) {
  const map: Record<string, string> = {
    "Я.Маркет": "ЯМ",
    "Otzovik": "OZ",
    "2GIS": "2G",
    "Google Maps": "GM",
    "Trustpilot": "TP",
    "App Store": "AS",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className="flex h-4 w-4 items-center justify-center rounded bg-muted text-[8px] font-bold tracking-tight text-foreground">
        {map[source] ?? "··"}
      </span>
      {source}
    </span>
  );
}

export function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-ai/30 bg-ai-soft/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ai-foreground">
      <Target className="h-2.5 w-2.5" /> AI
    </span>
  );
}
