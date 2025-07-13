import { AddressLike, Contract, ethers } from "ethers";

import { ABI, GET_ALL_FAUCETS_METADATA, GET_FAUCET_METADATA, TAGS } from "@/constants";
import { executeGraphQLQuery } from "@/lib/utils";
import { FaucetMetadata } from "@/types";

import { rpcProvider } from "..";
import { GetFaucetMetadataResponse, IFaucetService } from "./types";

export class FaucetService implements IFaucetService {
  public async getAllFaucetsMetadata(): Promise<FaucetMetadata[]> {
    const res = await executeGraphQLQuery<GetFaucetMetadataResponse[]>("faucets", GET_ALL_FAUCETS_METADATA, {
      tags: TAGS.getAllFaucetMetadata(),
    });

    return res.map(faucet => ({
      faucetAddress: faucet.faucetAddress,
      tokenAddress: faucet.tokenAddress,
      lockTime: +faucet.lockTime,
      withdrawalAmount: +faucet.withdrawalAmount,
    }));
  }

  public async getMetadata(tokenAddress: AddressLike): Promise<FaucetMetadata | undefined> {
    const res = (
      await executeGraphQLQuery<GetFaucetMetadataResponse[]>("faucets", GET_FAUCET_METADATA(tokenAddress as string), {
        tags: TAGS.getFaucetMetadata(tokenAddress as string),
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

  public async requestTokens(faucet: AddressLike, _recipientAddress: AddressLike): Promise<void> {
    const wallet = new ethers.Wallet("private key", rpcProvider);
    const faucetContract = new Contract(faucet as string, ABI.FAUCET, wallet);
    await faucetContract.requestTokens();
  }
}
