import { TokenMetadata } from "./token";

export type PoolInfo = {
  poolAddress: string;
  tokenA: TokenMetadata & {
    reserve: number;
    allTimeVolume: number;
    allTimeFee: number;
  };
  tokenB: TokenMetadata & {
    reserve: number;
    allTimeVolume: number;
    allTimeFee: number;
  };
  lpToken: TokenMetadata;
  feeTier: number;
};

export type UserShare = {
  poolAddress: string;
  userShare: number;
};

export type GetAmountsOnRemovingLiquidity = {
  amountTokenA: string;
  amountTokenB: string;
};

export type PoolActivity = {
  id: string;
  timestamp: number;
  transactionHash: string;
  sender: string;
  tokenA: {
    name: string;
    ticker: string;
    tokenAddress: string;
    amount: number;
  };
  tokenB: {
    name: string;
    ticker: string;
    tokenAddress: string;
    amount: number;
  };
  reserveA: number;
  reserveB: number;
  feesA: number;
  feesB: number;
  lpTokenAmount: number;
  eventType: "AddLiquidity" | "RemoveLiquidity" | "Swap";
};

export type GetAmountOutOnSwap = {
  fee: { amount: number; token: TokenMetadata };
  tokenOut: string;
  amountOut: number;
  estimatedSwapTxFee: number;
};
