import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressLike, Eip1193Provider } from "ethers";
import { toast } from "sonner";

import { ABI, revalidateAllPools } from "@/constants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getSigner, parseRevertError } from "@/lib/utils";
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

      const signer = await getSigner(walletProvider as Eip1193Provider, address);

      const tx = await appService.poolService.addLiquidity(signer, poolAddress, tokenA, tokenB, amountTokenA, amountTokenB);
      const txHash = (await tx.wait())?.hash;
      if (!txHash) throw new Error("Could not add liquidity!");
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
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getBalances(address!) });
      await revalidateAllPools();
    },
  });
};
