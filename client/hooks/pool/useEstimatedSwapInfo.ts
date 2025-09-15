import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { appService } from "@/services";
import { PoolInfo } from "@/types";

export const useEstimatedSwapInfo = (pool: PoolInfo | undefined, tokenIn: string, amountIn: number) => {
  return useQuery({
    enabled: !!pool?.poolAddress,
    queryKey: QUERY_KEYS.getEstimatedSwapInfo(pool?.poolAddress || "", tokenIn, amountIn),
    queryFn: async () => {
      if (!pool?.poolAddress) return undefined;
      return appService.poolService.getAmountOutOnSwap(pool, tokenIn, amountIn);
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 6 * 1000,
  });
};
