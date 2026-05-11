import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingRegion({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-label={label} className="motion-page">
      {children}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function SkeletonLine({ className = "h-3 w-full" }: { className?: string }) {
  return <Skeleton className={className} />;
}

export function SkeletonPill({ className = "h-5 w-20" }: { className?: string }) {
  return <Skeleton className={`rounded-full ${className}`} />;
}

export function SectionTitleSkeleton() {
  return (
    <div className="space-y-2">
      <SkeletonLine className="h-4 w-40" />
      <SkeletonLine className="h-3 w-64 max-w-full" />
    </div>
  );
}

export function KpiStripSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Card className="grid grid-cols-2 divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3 p-4">
          <SkeletonLine className="h-3 w-28" />
          <div className="flex items-end justify-between gap-3">
            <SkeletonLine className="h-8 w-20" />
            <SkeletonPill className="h-4 w-12" />
          </div>
        </div>
      ))}
    </Card>
  );
}

export function ChartCardSkeleton({
  titleWidth = "w-44",
  height = "h-[240px]",
}: {
  titleWidth?: string;
  height?: string;
}) {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <SkeletonLine className={`h-4 ${titleWidth}`} />
          <SkeletonLine className="h-3 w-56 max-w-full" />
        </div>
        <SkeletonPill className="h-6 w-16" />
      </div>
      <Skeleton className={`${height} w-full rounded-lg`} />
    </Card>
  );
}

export function InsightCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-1.5">
          <SkeletonPill />
          <SkeletonPill className="h-5 w-16" />
        </div>
        <SkeletonLine className="h-3 w-16" />
      </div>
      <div className="space-y-2">
        <SkeletonLine className="h-4 w-11/12" />
        <SkeletonLine className="h-4 w-4/5" />
      </div>
      <SkeletonPill className="h-5 w-40" />
      <div className="grid grid-cols-2 gap-2.5 rounded-lg border bg-muted/20 p-2.5">
        <div className="space-y-2">
          <SkeletonLine className="h-3 w-16" />
          <SkeletonLine className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <SkeletonLine className="h-3 w-24" />
          <SkeletonLine className="h-4 w-16" />
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between border-t pt-3">
        <SkeletonLine className="h-3 w-28" />
        <SkeletonLine className="h-3 w-20" />
      </div>
    </Card>
  );
}

export function TableSkeleton({ columns = 6, rows = 8 }: { columns?: number; rows?: number }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <Skeleton className="h-8 w-[260px]" />
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-8 w-[160px]" />
        <Skeleton className="ml-auto h-8 w-[130px]" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="border-b bg-muted/30">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-4 py-3">
                  <SkeletonLine className="h-3 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <SkeletonLine className={colIndex === 0 ? "h-3 w-64" : "h-3 w-20"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function TableRowsSkeleton({ columns = 4, rows = 4 }: { columns?: number; rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-xs">
        <thead className="border-b bg-muted/30">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-4 py-3">
                <SkeletonLine className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b last:border-0">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <SkeletonLine className={colIndex === 0 ? "h-3 w-36" : "h-3 w-24"} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TopicCardSkeleton() {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <SkeletonPill className="h-5 w-20" />
          <SkeletonLine className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <SkeletonLine className="h-5 w-3/4" />
      <Skeleton className="h-12 w-full rounded-lg" />
      <div className="flex gap-1 overflow-hidden">
        <Skeleton className="h-1.5 w-1/3 rounded-full" />
        <Skeleton className="h-1.5 w-1/4 rounded-full" />
        <Skeleton className="h-1.5 flex-1 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-1.5 border-t pt-3">
        <SkeletonPill className="h-5 w-24" />
        <SkeletonPill className="h-5 w-28" />
        <SkeletonPill className="h-5 w-20" />
      </div>
    </Card>
  );
}

export function ReviewCounterSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="space-y-2 p-3">
          <SkeletonLine className="h-3 w-24" />
          <SkeletonLine className="h-8 w-14" />
        </Card>
      ))}
    </div>
  );
}
