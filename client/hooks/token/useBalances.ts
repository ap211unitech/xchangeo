import { useAppKitAccount } from "@reown/appkit/react";
import { useQuery } from "@tanstack/react-query";

import { NATIVE_TOKEN } from "@/constants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { formatBalance } from "@/lib/utils";
import { appService } from "@/services";
import { TokenMetadata, TokenWithBalance } from "@/types";

export const useBalances = (tokens: TokenMetadata[]) => {
  const { address = "" } = useAppKitAccount();

  return useQuery<TokenWithBalance[]>({
    enabled: !!address,
    queryKey: QUERY_KEYS.getBalances(address),
    queryFn: async () => {
      const balances: number[] = await Promise.all([
        appService.tokenService.getBalance(NATIVE_TOKEN.contractAddress, address), // Native Token Balance
        ...tokens.map(({ contractAddress }) => appService.tokenService.getBalance(contractAddress, address)),
      ]);

      return [
        { ...NATIVE_TOKEN, balance: formatBalance(balances.at(0) ?? 0) },
        ...tokens.map((token, index) => ({
          ...token,
          balance: formatBalance(balances.at(index + 1) ?? 0),
        })),
      ];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 6 * 1000,
  });
};
