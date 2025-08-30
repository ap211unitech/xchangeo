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
}
