import { AddressLike } from "ethers";

export type FaucetMetadata = {
  token: string;
  lockTime: number;
  withdrawalAmount: number;
};

export interface IFaucetService {
  getMetadata: (_faucet: AddressLike) => Promise<FaucetMetadata>;
  requestTokens: (_faucet: AddressLike, _recipientAddress: AddressLike) => Promise<void>;
}
