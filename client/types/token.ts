export type TokenMetadata = {
  name: string;
  ticker: string;
  contractAddress: string;
};

export type TokenWithBalance = TokenMetadata & {
  balance: number;
};
