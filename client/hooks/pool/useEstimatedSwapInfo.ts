import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { appService } from "@/services";
import { PoolInfo } from "@/types";

export const useEstimatedSwapInfo = (pool: PoolInfo, tokenIn: string, amountIn: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.getEstimatedSwapInfo(pool.poolAddress, tokenIn, amountIn),
    queryFn: async () => {
      return appService.poolService.getAmountOutOnSwap(pool, tokenIn, amountIn);
    },
  });
};
