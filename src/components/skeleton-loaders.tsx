import { Skeleton } from "@/components/ui/skeleton";

export function StatSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <div>
        <Skeleton className="h-8 w-[120px]" />
      </div>
    </div>
  );
}

export function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-[250px]" />
      <div className="rounded-md">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

export function BusinessSwitcherSkeleton() {
  return (
    <div className="flex items-center gap-2 p-4">
      <Skeleton className="h-8 w-8 rounded-lg"></Skeleton>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded"></Skeleton>
        <Skeleton className="h-3 w-1/2 rounded"></Skeleton>
      </div>
    </div>
  );
}

export function NavUserSkeleton() {
  return (
    <div className="flex items-center gap-2 p-4">
      <Skeleton className="h-8 w-8 rounded-lg"></Skeleton>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded"></Skeleton>
        <Skeleton className="h-3 w-1/2 rounded"></Skeleton>
      </div>
    </div>
  );
}
