import { AppShell } from "@/components/app-shell";
import {
  LoadingRegion,
  SectionTitleSkeleton,
  TopicCardSkeleton,
} from "@/components/skeletons/shared";

export function TopicsSkeleton() {
  return (
    <AppShell title="Темы" subtitle="Загрузка тематических кластеров">
      <LoadingRegion label="Загружаются темы">
        <div className="mx-auto max-w-[1400px] space-y-8 p-4 md:p-6">
          {Array.from({ length: 3 }).map((_, sectionIndex) => (
            <section key={sectionIndex}>
              <div className="mb-4 flex items-end justify-between gap-3">
                <SectionTitleSkeleton />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <TopicCardSkeleton key={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </LoadingRegion>
    </AppShell>
  );
}
