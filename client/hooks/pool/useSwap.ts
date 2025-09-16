import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressLike, Eip1193Provider } from "ethers";
import { toast } from "sonner";

import { ABI, revalidateAllPools } from "@/constants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getSigner, parseRevertError } from "@/lib/utils";
import { appService } from "@/services";
import { PoolInfo } from "@/types";

type SwapProps = {
  pool?: PoolInfo;
  tokenIn: AddressLike;
  amountIn: number;
  maxSlippage: number;
};

export const useSwap = () => {
  const queryClient = useQueryClient();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  return useMutation({
    mutationFn: async ({ pool, tokenIn, amountIn, maxSlippage }: SwapProps) => {
      if (!address || !walletProvider) throw new Error("Please connect your wallet");
      if (!pool) throw new Error("Invalid pool");

      const signer = await getSigner(walletProvider as Eip1193Provider, address);

      //  TODO: Handle sllipage
      const tx = await appService.poolService.swap(signer, pool, tokenIn, amountIn, maxSlippage);
      const txHash = (await tx.wait())?.hash;
      if (!txHash) throw new Error("Could not swap tokens!");
      return { txHash, pool, tokenIn, amountIn };
    },
    onSuccess: ({ txHash }) =>
      toast.success("Tokens swapped successfully", {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank"),
        },
      }),
    onError: error => toast.error(parseRevertError(error, ABI.ERC20_SWAP)),
    onSettled: async data => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getBalances(address!) });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getEstimatedSwapInfo(data?.pool?.poolAddress || "", data?.tokenIn.toString() || "", data?.amountIn ?? 0),
      });
      await revalidateAllPools();
    },
  });
};
