import { useAppKitAccount } from "@reown/appkit/react";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { appService } from "@/services";
import { TokenMetadata } from "@/services/types";

export const useBalances = (tokens: TokenMetadata[]) => {
  const { address = "" } = useAppKitAccount();

  return useQuery({
    enabled: !!address,
    queryKey: QUERY_KEY.getBalances(address),
    queryFn: async () => {
      const balances: number[] = await Promise.all([
        appService.tokenService.getBalance(null, address), // Native Token Balance
        ...tokens.map(({ contractAddress }) => appService.tokenService.getBalance(contractAddress, address)),
      ]);

      return balances;
    },
  });
};
