import { AppShell } from "@/components/app-shell";
import { LoadingRegion, ReviewCounterSkeleton, TableSkeleton } from "@/components/skeletons/shared";

export function ReviewsSkeleton() {
  return (
    <AppShell title="Отзывы" subtitle="Загрузка отзывов и фильтров">
      <LoadingRegion label="Загружаются отзывы">
        <div className="space-y-4 p-4 md:p-6">
          <ReviewCounterSkeleton />
          <TableSkeleton columns={8} rows={9} />
        </div>
      </LoadingRegion>
    </AppShell>
  );
}
