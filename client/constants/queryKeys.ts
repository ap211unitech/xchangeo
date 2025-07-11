import { PREFIX } from ".";

export const QUERY_KEYS = {
  getBalances: (account: string) => [PREFIX, account],
  getWalletTokens: () => [PREFIX, "getWalletTokens"],
};
