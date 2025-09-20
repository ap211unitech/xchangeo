import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { appService } from "@/services";

export const usePoolInfo = (poolAddress: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.getPoolInfo(poolAddress),
    queryFn: async () => {
      return appService.poolService.getPoolInfo(poolAddress);
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 12 * 1000,
  });
};
