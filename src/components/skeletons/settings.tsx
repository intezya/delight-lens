import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LoadingRegion,
  SectionTitleSkeleton,
  SkeletonLine,
  TableRowsSkeleton,
} from "@/components/skeletons/shared";

export function SettingsSkeleton() {
  return (
    <AppShell title="Настройки" subtitle="Загрузка источников и команды">
      <LoadingRegion label="Загружаются настройки">
        <div className="grid grid-cols-1 gap-4 p-4 md:p-6 lg:grid-cols-3">
          <Card className="space-y-4 p-5 lg:col-span-2">
            <SectionTitleSkeleton />
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-16 rounded-lg" />
              ))}
            </div>
          </Card>
          <Card className="space-y-5 p-5">
            <SectionTitleSkeleton />
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between gap-3">
                  <SkeletonLine className="h-3 w-28" />
                  <SkeletonLine className="h-3 w-10" />
                </div>
                <Skeleton className="h-5 w-full rounded-full" />
              </div>
            ))}
          </Card>
          <Card className="space-y-4 p-5 lg:col-span-2">
            <SectionTitleSkeleton />
            <TableRowsSkeleton columns={4} rows={4} />
          </Card>
          <Card className="space-y-4 p-5">
            <SectionTitleSkeleton />
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-full rounded-lg" />
            ))}
          </Card>
        </div>
      </LoadingRegion>
    </AppShell>
  );
}
