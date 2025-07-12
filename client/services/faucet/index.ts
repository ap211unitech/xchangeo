import { AddressLike, Contract, ethers } from "ethers";

import { ABI } from "@/constants";
import { TokenMetadata } from "@/types";

import { rpcProvider } from "..";
import { FaucetMetadata, IFaucetService } from "./types";

export class FaucetService implements IFaucetService {
  public async getMetadata(_faucet: AddressLike): Promise<FaucetMetadata> {}

  public async requestTokens(faucet: AddressLike, recipientAddress: AddressLike): Promise<void> {
    const wallet = new ethers.Wallet("private key", rpcProvider);
    const faucetContract = new Contract(faucet as string, ABI.FAUCET, wallet);
    await faucetContract.requestTokens();
  }
}
