import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  InsightCardSkeleton,
  LoadingRegion,
  SkeletonLine,
  SkeletonPill,
} from "@/components/skeletons/shared";

export function InsightsSkeleton() {
  return (
    <AppShell title="Гипотезы AI" subtitle="Загрузка гипотез и статусов">
      <LoadingRegion label="Загружаются гипотезы">
        <div className="space-y-4 p-4 md:p-6">
          <Card className="space-y-4 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-3">
                <div className="flex items-center gap-2">
                  <SkeletonPill className="h-5 w-12" />
                  <SkeletonLine className="h-3 w-32" />
                </div>
                <SkeletonLine className="h-7 w-[460px] max-w-full" />
                <SkeletonLine className="h-3 w-[520px] max-w-full" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-16 w-36 rounded-lg" />
                <Skeleton className="h-16 w-28 rounded-lg" />
              </div>
            </div>
          </Card>
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-9 w-[520px] max-w-full" />
            <Skeleton className="ml-auto h-9 w-36" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <InsightCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </LoadingRegion>
    </AppShell>
  );
}
