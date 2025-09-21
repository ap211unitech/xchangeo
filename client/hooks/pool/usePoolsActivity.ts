import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { appService } from "@/services";
import { PoolActivity } from "@/types";

export const usePoolsActivity = () => {
  return useQuery<PoolActivity[]>({
    queryKey: QUERY_KEYS.getPoolsActivity(),
    queryFn: async () => {
      return appService.poolService.getPoolsActivity();
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 6 * 1000,
  });
};
