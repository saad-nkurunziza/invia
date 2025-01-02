import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
      <div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  );
};

export default loading;
