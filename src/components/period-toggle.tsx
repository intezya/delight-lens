import { cn } from "@/lib/utils";

export type Period = "24h" | "7d" | "30d";

const OPTIONS: { id: Period; label: string }[] = [
  { id: "24h", label: "24 часа" },
  { id: "7d", label: "7 дней" },
  { id: "30d", label: "30 дней" },
];

export function PeriodToggle({ value, onChange }: { value: Period; onChange: (v: Period) => void }) {
  return (
    <div className="inline-flex items-center rounded-md border bg-card p-0.5">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded px-2.5 py-1 text-[11px] font-medium transition",
            value === o.id
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function periodLabel(p: Period) {
  return p === "24h" ? "за последние 24 часа" : p === "7d" ? "за 7 дней" : "за 30 дней";
}
