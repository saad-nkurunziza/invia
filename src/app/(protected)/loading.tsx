import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="space-y-8">
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-10 w-2/5 mt-6" />
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
};

export default loading;
