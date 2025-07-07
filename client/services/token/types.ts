import { AddressLike } from "ethers";
import { ReactNode } from "react";

import { TokenMetadata } from "../types";

export type GetAllTokensResponse = {
  name: string;
  symbol: string;
  tokenAddress: string;
  logo: ReactNode;
};

/* eslint-disable */
export interface ITokenService {
  getAllTokens: () => Promise<TokenMetadata[]>;
  getBalance: (token: string | null, account: AddressLike) => Promise<number>;
}
/* eslint-enable */
