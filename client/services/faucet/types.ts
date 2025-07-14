import { AddressLike } from "ethers";

import { FaucetMetadata } from "@/types";

export type GetFaucetMetadataResponse = {
  id: string;
  faucetAddress: string;
  tokenAddress: string;
  lockTime: string;
  withdrawalAmount: string;
};

export interface IFaucetService {
  getAllFaucetsMetadata: () => Promise<FaucetMetadata[]>;
  getMetadata: (_tokenAddress: AddressLike) => Promise<FaucetMetadata | undefined>;
  requestTokens: (_faucet: AddressLike, _recipientAddress: AddressLike) => Promise<string | undefined>;
}
