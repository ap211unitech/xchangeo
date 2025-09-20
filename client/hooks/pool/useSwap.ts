import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressLike, Eip1193Provider } from "ethers";
import { toast } from "sonner";

import { ABI, revalidateAllPools } from "@/constants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getSigner, parseRevertError } from "@/lib/utils";
import { appService } from "@/services";
import { GetAmountOutOnSwap, PoolInfo } from "@/types";

type SwapProps = {
  pool?: PoolInfo;
  tokenIn: AddressLike;
  amountIn: number;
  maxSlippage: number;
  cb: (_invalidatedAmountOut: number) => void;
};

export const useSwap = () => {
  const queryClient = useQueryClient();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  return useMutation({
    mutationFn: async ({ pool, tokenIn, amountIn, maxSlippage, cb }: SwapProps) => {
      if (!address || !walletProvider) throw new Error("Please connect your wallet");
      if (!pool) throw new Error("Invalid pool");

      const signer = await getSigner(walletProvider as Eip1193Provider, address);

      const tx = await appService.poolService.swap(signer, pool.poolAddress, tokenIn, amountIn, maxSlippage);
      const txHash = (await tx.wait())?.hash;
      if (!txHash) throw new Error("Could not swap tokens!");
      return { txHash, pool, tokenIn, amountIn, cb };
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
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getBalances(address!) });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getPoolInfo(data?.pool.poolAddress || "") });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getEstimatedSwapInfo(data?.pool.poolAddress || "", data?.tokenIn.toString() || "", data?.amountIn ?? 0),
      });

      const invalidatedEstimatedInfo = queryClient.getQueryData<GetAmountOutOnSwap>(
        QUERY_KEYS.getEstimatedSwapInfo(data?.pool.poolAddress || "", data?.tokenIn.toString() || "", data?.amountIn ?? 0),
      );

      data?.cb(invalidatedEstimatedInfo?.amountOut ?? 0);
      await revalidateAllPools();
    },
  });
};
