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

export function InsightDetailSkeleton() {
  return (
    <AppShell title="Гипотеза" subtitle="Загрузка расследования">
      <LoadingRegion label="Загружается гипотеза">
        <div className="mx-auto grid max-w-[1280px] gap-8 p-4 md:p-8 lg:grid-cols-[1fr_320px] lg:p-10">
          <div className="min-w-0 space-y-8">
            <div className="flex gap-2">
              <SkeletonLine className="h-3 w-20" />
              <SkeletonLine className="h-3 w-24" />
              <SkeletonLine className="h-3 w-28" />
            </div>
            <header className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <SkeletonPill className="h-5 w-12" />
                <SkeletonPill className="h-5 w-24" />
                <SkeletonPill className="h-5 w-20" />
              </div>
              <SkeletonLine className="h-9 w-11/12" />
              <SkeletonLine className="h-9 w-3/4" />
              <div className="space-y-2">
                <SkeletonLine className="h-4 w-full max-w-3xl" />
                <SkeletonLine className="h-4 w-5/6 max-w-3xl" />
              </div>
            </header>
            <Card className="space-y-4 p-5">
              <SectionTitleSkeleton />
              <div className="grid gap-3 md:grid-cols-3">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </Card>
            <Card className="space-y-3 p-5">
              <SectionTitleSkeleton />
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-lg" />
              ))}
            </Card>
            <div className="grid gap-4 lg:grid-cols-2">
              <ChartCardSkeleton height="h-[180px]" />
              <ChartCardSkeleton height="h-[180px]" />
            </div>
          </div>
          <aside className="space-y-4">
            <Card className="space-y-4 p-5">
              <SectionTitleSkeleton />
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 rounded-lg" />
              ))}
              <Skeleton className="h-9 w-full" />
            </Card>
          </aside>
        </div>
      </LoadingRegion>
    </AppShell>
  );
}
