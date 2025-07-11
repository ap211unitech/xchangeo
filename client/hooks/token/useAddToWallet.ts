import { useAppKitProvider } from "@reown/appkit/react";
import { useMutation } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";

import { appService } from "@/services";
import { TokenMetadata } from "@/types";

export const useAddToWallet = () => {
  const { walletProvider } = useAppKitProvider("eip155");

  return useMutation({
    mutationFn: async (token: TokenMetadata) => {
      return appService.tokenService.addToWallet(walletProvider as Eip1193Provider, token);
    },
  });
};
