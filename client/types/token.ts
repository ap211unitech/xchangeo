export type TokenMetadata = {
  name: string;
  ticker: string;
  contractAddress: string | null;
};

export type TokenWithBalance = TokenMetadata & {
  balance: number;
};
