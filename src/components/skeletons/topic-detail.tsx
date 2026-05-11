import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartCardSkeleton,
  LoadingRegion,
  SectionTitleSkeleton,
  SkeletonLine,
  SkeletonPill,
} from "@/components/skeletons/shared";

export function TopicDetailSkeleton() {
  return (
    <AppShell title="Тема" subtitle="Загрузка детального разбора">
      <LoadingRegion label="Загружается тема">
        <div className="space-y-5 p-4 md:p-6">
          <SkeletonLine className="h-3 w-24" />
          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl space-y-3">
                <div className="flex gap-2">
                  <SkeletonPill className="h-5 w-20" />
                  <SkeletonPill className="h-5 w-12" />
                </div>
                <SkeletonLine className="h-7 w-[420px] max-w-full" />
                <SkeletonLine className="h-4 w-full max-w-xl" />
                <SkeletonLine className="h-4 w-4/5 max-w-xl" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-16 w-24 rounded-lg" />
                <Skeleton className="h-16 w-24 rounded-lg" />
                <Skeleton className="h-16 w-24 rounded-lg" />
              </div>
            </div>
          </Card>
          <Card className="space-y-3 p-5">
            <SectionTitleSkeleton />
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-lg" />
            ))}
          </Card>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartCardSkeleton />
            </div>
            <ChartCardSkeleton height="h-[240px]" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ChartCardSkeleton height="h-[220px]" />
            <ChartCardSkeleton height="h-[220px]" />
            <ChartCardSkeleton height="h-[220px]" />
          </div>
        </div>
      </LoadingRegion>
    </AppShell>
  );
}
