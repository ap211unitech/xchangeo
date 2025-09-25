import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { appService } from "@/services";
import { PoolActivity } from "@/types";

export const usePoolActivity = (poolAddress: string) => {
  return useQuery<PoolActivity[]>({
    queryKey: QUERY_KEYS.getPoolActivity(poolAddress),
    queryFn: async () => {
      return await appService.poolService.getPoolActivity(poolAddress);
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 6 * 1000,
  });
};
