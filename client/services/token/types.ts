import { AddressLike, Eip1193Provider, JsonRpcSigner, TransactionResponse } from "ethers";
import { ReactNode } from "react";

import { TokenMetadata } from "@/types";

export type GetAllTokensResponse = {
  name: string;
  symbol: string;
  tokenAddress: string;
  logo: ReactNode;
};

export interface ITokenService {
  getAllTokens: () => Promise<TokenMetadata[]>;
  getBalance: (_token: string | null, _account: AddressLike) => Promise<number>;
  getWalletTokens: () => string[];
  addToWallet: (_wallet: Eip1193Provider, _token: TokenMetadata) => Promise<boolean>;
  transfer: (_signer: JsonRpcSigner, _token: AddressLike, _recipientAddress: AddressLike, _amount: number) => Promise<TransactionResponse>;
}
