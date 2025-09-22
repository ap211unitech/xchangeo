import { AddressLike, JsonRpcSigner, TransactionResponse } from "ethers";

import { GetAmountOutOnSwap, GetAmountsOnRemovingLiquidity, PoolActivity, PoolInfo, UserShare } from "@/types";

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
  allTimeVolumeA: string;
  allTimeVolumeB: string;
  allTimeFeesA: string;
  allTimeFeesB: string;
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
  reserveA: string;
  reserveB: string;
  feesA: string;
  feesB: string;
  lpTokenAmount: string;
  transactionHash: string;
};

export interface IPoolService {
  getAllPools: () => Promise<PoolInfo[]>;
  getUserShare: (_poolsInfo: PoolInfo[], _address: string) => Promise<UserShare[]>;

  getAmountsOnRemovingLiquidity: (
    _poolAddress: AddressLike,
    _lpTokenAddress: AddressLike,
    _percentageToWithdraw: number,
    _address: string,
  ) => Promise<GetAmountsOnRemovingLiquidity>;

  getPoolActivity: (_poolAddress: string) => Promise<PoolActivity[]>;

  getPoolsActivity: () => Promise<PoolActivity[]>;

  getPoolInfo: (_poolAddress: string) => Promise<PoolInfo>;

  getAmountOutOnSwap: (_pool: PoolInfo, _tokenIn: AddressLike, _amountIn: number) => Promise<GetAmountOutOnSwap>;

  addLiquidity: (
    _signer: JsonRpcSigner,
    _poolAddress: AddressLike,
    _tokenA: AddressLike,
    _tokenB: AddressLike,
    _amountTokenA: number,
    _amountTokenB: number,
    _maxSlippage: number,
  ) => Promise<TransactionResponse>;

  removeLiquidity: (
    _signer: JsonRpcSigner,
    _poolAddress: AddressLike,
    _lpTokenAddress: AddressLike,
    _percentageToWithdraw: number,
  ) => Promise<TransactionResponse>;

  swap: (
    _signer: JsonRpcSigner,
    _poolAddress: AddressLike,
    _tokenIn: AddressLike,
    _amountIn: number,
    _maxSlippage: number,
  ) => Promise<TransactionResponse>;
}
