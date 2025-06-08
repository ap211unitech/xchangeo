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
