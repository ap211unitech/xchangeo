export type Token = {
  address: string;
  name: string;
  ticker: string;
  logo: string;
  amount: string;
};

export type SwapTransaction = {
  timestamp: string; // ISO timestamp format
  transactionHash: string; // Transaction hash
  account: string; // Address of the trader
  tokenIn: Token; // Token swapped in
  tokenOut: Token; // Token swapped out
};
