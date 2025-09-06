import { useAppKitAccount } from "@reown/appkit/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { appService } from "@/services";
import { PoolInfo } from "@/types";

export const useUserShare = (pools: PoolInfo[]) => {
  const { address } = useAppKitAccount();

  const enabled = useMemo(() => !!address, [address]);

  return useQuery({
    enabled,
    queryKey: QUERY_KEYS.getUserShares(address!),
    queryFn: async () => {
      if (!address) return [];
      return await appService.poolService.getUserShare(pools, address);
    },
  });
};
