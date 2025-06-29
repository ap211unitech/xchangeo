export type Token = {
  name: string;
  ticker: string;
  contractAddress: string;
  logo: string;
  balance: number;
};

export type FaucetTransaction = {
  name: string;
  ticker: string;
  contractAddress: string;
  recipientAddress: string;
  transactionHash: string;
  logo: string;
  amount: number;
  timestamp: string;
};

export type PoolTokenInfo = {
  symbol: string;
  name: string;
  logo: string; // URL to token icon
  reserve: number; // amount of token in the pool
  volume: number; // volume traded (daily or all-time)
};

export type LpToken = {
  name: string;
  symbol: string;
  logo: string;
  amount: number;
};

export type LiquidityPool = {
  lpAddress: string;
  tokenA: PoolTokenInfo;
  tokenB: PoolTokenInfo;
  feeTier: number; // in basis points, e.g., 30 = 0.3%
  userSharePercent: number; // user's share of the pool in %
  lpToken: LpToken;
};
