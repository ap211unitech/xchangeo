import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressLike, Eip1193Provider } from "ethers";
import { toast } from "sonner";

import { ABI } from "@/constants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { parseRevertError } from "@/lib/utils";
import { appService } from "@/services";

type AddLiquidityProps = {
  poolAddress: AddressLike;
  tokenA: AddressLike;
  tokenB: AddressLike;
  amountTokenA: number;
  amountTokenB: number;
};

export const useAddLiquidity = () => {
  const queryClient = useQueryClient();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  return useMutation({
    mutationFn: async ({ poolAddress, tokenA, tokenB, amountTokenA, amountTokenB }: AddLiquidityProps) => {
      if (!address || !walletProvider) throw new Error("Please connect your wallet");

      const tx = await appService.poolService.addLiquidity(
        walletProvider as Eip1193Provider,
        poolAddress,
        tokenA,
        tokenB,
        amountTokenA,
        amountTokenB,
      );
      const txHash = (await tx.wait())?.hash;
      if (!txHash) throw new Error("Could not transfer tokens!");
      return txHash;
    },
    onSuccess: txHash =>
      toast.success("Liquidity added successfully", {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank"),
        },
      }),
    onError: error => toast.error(parseRevertError(error, ABI.ERC20_SWAP)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getBalances(address!) }),
  });
};
