import { AddressLike, JsonRpcSigner, TransactionResponse } from "ethers";

import { GetAmountsOnRemovingLiquidity, PoolActivity, PoolInfo, UserShare } from "@/types";

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

export type GetPoolsActivityResponse = {
  id: string;
  amountA: string;
  amountB: string;
  eventType: "AddLiquidity" | "RemoveLiquidity" | "Swap";
  sender: string;
  timestamp: string;
  tokenA: {
    name: string;
    symbol: string;
    tokenAddress: string;
  };
  tokenB: {
    name: string;
    symbol: string;
    tokenAddress: string;
  };
  transactionHash: string;
};

export interface IPoolService {
  getAllPools: () => Promise<PoolInfo[]>;
  getUserShare: (_poolsInfo: PoolInfo[], _address: string) => Promise<UserShare[]>;

  addLiquidity: (
    _signer: JsonRpcSigner,
    _poolAddress: AddressLike,
    _tokenA: AddressLike,
    _tokenB: AddressLike,
    _amountTokenA: number,
    _amountTokenB: number,
  ) => Promise<TransactionResponse>;

  removeLiquidity: (
    _signer: JsonRpcSigner,
    _poolAddress: AddressLike,
    _lpTokenAddress: AddressLike,
    _percentageToWithdraw: number,
  ) => Promise<TransactionResponse>;

  getAmountsOnRemovingLiquidity: (
    _poolAddress: AddressLike,
    _lpTokenAddress: AddressLike,
    _percentageToWithdraw: number,
    _address: string,
  ) => Promise<GetAmountsOnRemovingLiquidity>;

  getPoolsActivity: () => Promise<PoolActivity[]>;
}
