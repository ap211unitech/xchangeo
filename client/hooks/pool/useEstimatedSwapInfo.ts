import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { appService } from "@/services";
import { GetAmountOutOnSwap, PoolInfo } from "@/types";

export const useEstimatedSwapInfo = (pool: PoolInfo | undefined, tokenIn: string, amountIn: number) => {
  return useQuery<GetAmountOutOnSwap | undefined>({
    enabled: !!pool?.poolAddress && amountIn > 0,
    queryKey: QUERY_KEYS.getEstimatedSwapInfo(pool?.poolAddress as string, tokenIn, amountIn),
    queryFn: async () => {
      const allPools = await appService.poolService.getAllPools();
      const choosenPool = allPools.find(p => p.poolAddress === pool?.poolAddress);

      if (!choosenPool) return undefined;

      return appService.poolService.getAmountOutOnSwap(choosenPool, tokenIn, amountIn);
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 12 * 1000,
  });
};
