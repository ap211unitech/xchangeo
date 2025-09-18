import { PoolInfo } from "@/types";

import { PREFIX } from ".";

export const QUERY_KEYS = {
  getBalances: (account: string) => [PREFIX, "getBalances", account],
  getUserShares: (account: string) => [PREFIX, "getUserShares", account],
  getWalletTokens: () => [PREFIX, "getWalletTokens"],
  getAmountsOnRemoveLiquidity: (poolAddress: string, lpTokenAddress: string, percentageToWithdraw: number) => [
    PREFIX,
    "getAmountsOnRemoveLiquidity",
    poolAddress,
    lpTokenAddress,
    percentageToWithdraw,
  ],
  getPoolsActivity: () => [PREFIX, "getPoolsActivity"],
  getEstimatedSwapInfo: (pool: PoolInfo | undefined, tokenIn: string, amountIn: number) => [
    PREFIX,
    "getEstimatedSwapInfo",
    JSON.stringify(pool),
    tokenIn,
    amountIn,
  ],
};
