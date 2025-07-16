export type FaucetMetadata = {
  faucetAddress: string;
  tokenAddress: string;
  lockTime: number;
  withdrawalAmount: number;
};

export type FaucetTransactionHistory = {
  id: string;
  from: string;
  to: string;
  amount: number;
  eventType: string;
  timestamp: number;
  transactionHash: string;
  token: {
    name: string;
    ticker: string;
    tokenAddress: string;
  };
};
