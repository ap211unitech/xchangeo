import { useAppKitProvider } from "@reown/appkit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { appService } from "@/services";
import { TokenMetadata } from "@/types";

export const useAddToWallet = () => {
  const queryClient = useQueryClient();
  const { walletProvider } = useAppKitProvider("eip155");

  return useMutation({
    mutationFn: async (token: TokenMetadata) => {
      return appService.tokenService.addToWallet(walletProvider as Eip1193Provider, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getWalletTokens() });
    },
  });
};
