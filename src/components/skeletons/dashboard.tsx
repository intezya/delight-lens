import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartCardSkeleton,
  KpiStripSkeleton,
  LoadingRegion,
  SectionTitleSkeleton,
  SkeletonLine,
  SkeletonPill,
} from "@/components/skeletons/shared";

function DashboardBriefSkeleton() {
  return (
    <Card className="relative overflow-hidden border-ai/20 bg-card p-5 shadow-[var(--shadow-elev-2)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-3">
            <SkeletonPill className="h-5 w-12" />
            <SkeletonLine className="h-3 w-56" />
          </div>
          <SkeletonLine className="h-7 w-[520px] max-w-full" />
          <SkeletonLine className="h-7 w-[420px] max-w-full" />
          <div className="space-y-2 pt-1">
            <SkeletonLine className="h-3 w-full max-w-2xl" />
            <SkeletonLine className="h-3 w-5/6 max-w-2xl" />
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 lg:items-end">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </Card>
  );
}

function AttentionFeedSkeleton() {
  return (
    <Card className="space-y-3 p-4">
      <SectionTitleSkeleton />
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-l-[3px] p-3.5">
          <div className="flex items-start gap-3">
            <Skeleton className="mt-0.5 h-4 w-4 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <SkeletonLine className="h-4 w-3/5" />
                <SkeletonPill className="h-5 w-16" />
              </div>
              <SkeletonLine className="h-3 w-5/6" />
              <div className="flex gap-3">
                <SkeletonPill className="h-5 w-32" />
                <SkeletonLine className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <AppShell title="Дашборд" subtitle="Загрузка аналитики отзывов">
      <LoadingRegion label="Загружается дашборд">
        <div className="space-y-5 p-4 md:p-6">
          <DashboardBriefSkeleton />
          <KpiStripSkeleton />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <AttentionFeedSkeleton />
            <ChartCardSkeleton titleWidth="w-36" />
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ChartCardSkeleton titleWidth="w-48" height="h-[220px]" />
            <ChartCardSkeleton titleWidth="w-40" height="h-[220px]" />
          </div>
        </div>
      </LoadingRegion>
    </AppShell>
  );
}
