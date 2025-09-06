import { useAppKitAccount } from "@reown/appkit/react";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { appService } from "@/services";
import { GetAmountsOnRemovingLiquidity } from "@/types";

export const useGetAmountsOnRemoveLiquidity = (poolAddress: string, lpTokenAddress: string, percentageToWithdraw: number) => {
  const { address } = useAppKitAccount();

  return useQuery<GetAmountsOnRemovingLiquidity>({
    queryKey: QUERY_KEYS.getAmountsOnRemoveLiquidity(poolAddress, lpTokenAddress, percentageToWithdraw),
    queryFn: async () => {
      if (!address) return { amountTokenA: "0", amountTokenB: "0" };
      return await appService.poolService.getAmountsOnRemovingLiquidity(poolAddress, lpTokenAddress, percentageToWithdraw, address);
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 6 * 1000,
  });
};
