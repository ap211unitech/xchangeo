export type GetAllTokensResult = {
  name: string;
  ticker: string;
  contractAddress: string;
  logo: string;
  balance: number;
};

export interface IToken {
  getAllTokens: () => Promise<GetAllTokensResult[]>;
}
