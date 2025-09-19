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
  getEstimatedSwapInfo: (poolAddress: string, tokenIn: string, amountIn: number) => [PREFIX, "getEstimatedSwapInfo", poolAddress, tokenIn, amountIn],
};
