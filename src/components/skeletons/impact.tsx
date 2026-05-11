import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartCardSkeleton,
  LoadingRegion,
  SectionTitleSkeleton,
  SkeletonLine,
  TableSkeleton,
} from "@/components/skeletons/shared";

export function ImpactSkeleton() {
  return (
    <AppShell title="Эффект изменений" subtitle="Загрузка метрик внедрений">
      <LoadingRegion label="Загружается эффект изменений">
        <div className="space-y-5 p-4 md:p-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="space-y-3 p-4">
                <SkeletonLine className="h-3 w-28" />
                <SkeletonLine className="h-8 w-20" />
                <SkeletonLine className="h-3 w-32" />
              </Card>
            ))}
          </div>
          <ChartCardSkeleton titleWidth="w-72" height="h-[260px]" />
          <TableSkeleton columns={7} rows={5} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCardSkeleton height="h-[220px]" />
            <ChartCardSkeleton height="h-[220px]" />
          </div>
          <Card className="space-y-3 p-4">
            <SectionTitleSkeleton />
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 rounded-lg" />
            ))}
          </Card>
        </div>
      </LoadingRegion>
    </AppShell>
  );
}
