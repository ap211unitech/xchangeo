import { AddressLike } from "ethers";

import { FaucetMetadata, FaucetTransactionHistory } from "@/types";

export type GetFaucetMetadataResponse = {
  id: string;
  faucetAddress: string;
  tokenAddress: string;
  lockTime: string;
  withdrawalAmount: string;
};

export type GetFaucetTransactionHistoryResponse = {
  amount: string;
  eventType: string;
  from: string;
  id: string;
  timestamp: string;
  to: string;
  transactionHash: string;
  token: {
    name: string;
    symbol: string;
    tokenAddress: string;
  };
};

export interface IFaucetService {
  getAllFaucetsMetadata: () => Promise<FaucetMetadata[]>;
  getFaucetTransactionsHistory: () => Promise<FaucetTransactionHistory[]>;
  getMetadata: (_tokenAddress: AddressLike) => Promise<FaucetMetadata | undefined>;
  requestTokens: (_faucet: AddressLike, _recipientAddress: AddressLike) => Promise<string | undefined>;
}
