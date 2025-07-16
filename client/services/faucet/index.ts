import { AddressLike, Contract, ethers, TransactionResponse } from "ethers";

import { CONFIG } from "@/config";
import { ABI, GET_ALL_FAUCETS_METADATA, GET_FAUCET_METADATA, GET_FAUCET_TRANSACTIONS, TAGS } from "@/constants";
import { executeGraphQLQuery, formatUnits } from "@/lib/utils";
import { FaucetMetadata, FaucetTransactionHistory } from "@/types";

import { rpcProvider } from "..";
import { GetFaucetMetadataResponse, GetFaucetTransactionHistoryResponse, IFaucetService } from "./types";

export class FaucetService implements IFaucetService {
  public async getAllFaucetsMetadata(): Promise<FaucetMetadata[]> {
    const res = await executeGraphQLQuery<GetFaucetMetadataResponse[]>("faucets", GET_ALL_FAUCETS_METADATA, {
      tags: [TAGS.getAllFaucetMetadata()],
    });

    return res.map(faucet => ({
      faucetAddress: faucet.faucetAddress,
      tokenAddress: faucet.tokenAddress,
      lockTime: +faucet.lockTime,
      withdrawalAmount: +faucet.withdrawalAmount,
    }));
  }

  public async getFaucetTransactionsHistory(): Promise<FaucetTransactionHistory[]> {
    const res = await executeGraphQLQuery<GetFaucetTransactionHistoryResponse[]>("transfers", GET_FAUCET_TRANSACTIONS, {
      tags: [TAGS.getFaucetTransactionsHistory()],
    });

    return res.map(
      (tx): FaucetTransactionHistory => ({
        ...tx,
        amount: formatUnits(BigInt(tx.amount)),
        timestamp: +tx.timestamp,
        token: { ...tx.token, ticker: tx.token.symbol },
      }),
    );
  }

  public async getMetadata(tokenAddress: AddressLike): Promise<FaucetMetadata | undefined> {
    const res = (
      await executeGraphQLQuery<GetFaucetMetadataResponse[]>("faucets", GET_FAUCET_METADATA(tokenAddress as string), {
        tags: [TAGS.getFaucetMetadata(tokenAddress as string)],
      })
    ).at(0);

    return res
      ? {
          faucetAddress: res.faucetAddress,
          tokenAddress: res.tokenAddress,
          lockTime: +res.lockTime,
          withdrawalAmount: +res.withdrawalAmount,
        }
      : undefined;
  }

  public async requestTokens(faucet: AddressLike, recipientAddress: AddressLike): Promise<string | undefined> {
    if (!faucet || !ethers.isAddress(faucet)) throw new Error("Invalid faucet contract address");

    const wallet = new ethers.Wallet(CONFIG.FAUCET_RELAYER_PRIVATE_KEY, rpcProvider);
    const faucetContract = new Contract(faucet as string, ABI.FAUCET, wallet);
    const tx: TransactionResponse = await faucetContract.requestTokens(recipientAddress);
    return (await tx.wait())?.hash;
  }
}
