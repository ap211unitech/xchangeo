import { AddressLike } from "ethers";

export type GetAllTokensResult = {
  name: string;
  ticker: string;
  contractAddress: string;
  logo: string;
  balance: number;
};

/* eslint-disable */
export interface ITokenService {
  getAllTokens: () => Promise<GetAllTokensResult[]>;
  getBalance: (token: string | null, account: AddressLike) => Promise<number>;
}
/* eslint-enable */
