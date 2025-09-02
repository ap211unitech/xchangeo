import { AddressLike, Eip1193Provider, TransactionResponse } from "ethers";

import { PoolInfo } from "@/types";

interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  tokenAddress: string;
}

export type GetAllPoolsResponse = {
  id: string;
  pool: string;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  reserveA: string;
  reserveB: string;
  fee: string;
  lpToken: TokenInfo;
};

export interface IPoolService {
  getAllPools: () => Promise<PoolInfo[]>;
  addLiquidity: (
    _wallet: Eip1193Provider,
    _poolAddress: AddressLike,
    _tokenA: AddressLike,
    _tokenB: AddressLike,
    _amountTokenA: number,
    _amountTokenB: number,
  ) => Promise<TransactionResponse>;
}
