import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressLike, Eip1193Provider } from "ethers";
import { toast } from "sonner";

import { ABI } from "@/constants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getSigner, parseRevertError } from "@/lib/utils";
import { appService } from "@/services";

type RemoveLiquidityProps = {
  poolAddress: AddressLike;
  lpTokenAddress: string;
  percentageToWithdraw: number;
};

export const useRemoveLiquidity = () => {
  const queryClient = useQueryClient();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  return useMutation({
    mutationFn: async ({ poolAddress, lpTokenAddress, percentageToWithdraw }: RemoveLiquidityProps) => {
      if (!address || !walletProvider) throw new Error("Please connect your wallet");

      const signer = await getSigner(walletProvider as Eip1193Provider, address);

      const tx = await appService.poolService.removeLiquidity(signer, poolAddress, lpTokenAddress, percentageToWithdraw);
      const txHash = (await tx.wait())?.hash;
      if (!txHash) throw new Error("Could not remove liquidity!");
      return txHash;
    },
    onSuccess: txHash =>
      toast.success("Liquidity removed successfully", {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank"),
        },
      }),
    onError: error => toast.error(parseRevertError(error, ABI.ERC20_SWAP)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getBalances(address!) }),
  });
};
