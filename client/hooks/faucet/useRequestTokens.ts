import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { ABI, revalidate, TAGS } from "@/constants";
import { parseRevertError } from "@/lib/utils";
import { appService } from "@/services";

type RequestTokenProps = {
  faucetAddress: string;
  recipientAddress: string;
};

export const useRequestTokens = () => {
  return useMutation({
    mutationFn: async ({ faucetAddress, recipientAddress }: RequestTokenProps) => {
      const txHash = await appService.faucetService.requestTokens(faucetAddress, recipientAddress);
      if (!txHash) throw new Error("Could not sent tokens!");
      return txHash;
    },
    onSuccess: txHash =>
      toast.success("Tokens sent successfully", {
        action: {
          label: "View",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank"),
        },
      }),
    onError: error => toast.error(parseRevertError(error, ABI.FAUCET)),
    onSettled: () => revalidate(TAGS.getFaucetTransactionsHistory()),
  });
};
