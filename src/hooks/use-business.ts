import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useNetworkStatus } from "@/hooks/use-network";
import { Prisma } from "@prisma/client";

export type UserBusinessPayload = Prisma.BusinessUserGetPayload<{
  include: {
    business: true;
  };
}>;

interface UseBusinessDataReturn {
  activeBusiness: UserBusinessPayload | undefined | null;
  otherBusinesses: UserBusinessPayload[] | undefined | null;
  isLoading: boolean;
  error: Error | null;
}

export function useBusinessData(): UseBusinessDataReturn {
  const { isOnline } = useNetworkStatus();

  const {
    data: activeBusiness,
    error: activeError,
    isLoading: activeLoading,
  } = useSWR<UserBusinessPayload | null>("/api/business/active", fetcher, {
    revalidateOnFocus: isOnline,
    revalidateIfStale: isOnline,
    dedupingInterval: 300000,
    errorRetryCount: isOnline ? 3 : 0,
  });

  const {
    data: otherBusinesses,
    error: otherError,
    isLoading: otherLoading,
  } = useSWR<UserBusinessPayload[] | null>("/api/business/all", fetcher, {
    revalidateOnFocus: isOnline,
    revalidateIfStale: isOnline,
    dedupingInterval: 300000,
    errorRetryCount: isOnline ? 3 : 0,
  });
  console.log({ activeBusiness });
  return {
    activeBusiness,
    otherBusinesses,
    isLoading: activeLoading || otherLoading,
    error: activeError || otherError,
  };
}
