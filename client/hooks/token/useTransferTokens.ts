import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eip1193Provider } from "ethers";
import { toast } from "sonner";

import { ABI } from "@/constants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getSigner, parseRevertError } from "@/lib/utils";
import { appService } from "@/services";

type TransferTokenProps = {
  token: string;
  recipientAddress: string;
  amount: number;
};

export const useTransferTokens = () => {
  const queryClient = useQueryClient();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  return useMutation({
    mutationFn: async ({ recipientAddress, token, amount }: TransferTokenProps) => {
      if (!address || !walletProvider) throw new Error("Please connect your wallet");

      const signer = await getSigner(walletProvider as Eip1193Provider, address);

      const tx = await appService.tokenService.transfer(signer, token, recipientAddress, amount);
      const txHash = (await tx.wait())?.hash;
      if (!txHash) throw new Error("Could not transfer tokens!");
      return txHash;
    },
    onSuccess: txHash =>
      toast.success("Tokens transferred successfully", {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank"),
        },
      }),
    onError: error => toast.error(parseRevertError(error, ABI.ERC20TOKEN)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getBalances(address!) }),
  });
};
