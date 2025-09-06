import { PREFIX } from ".";

export const QUERY_KEYS = {
  getBalances: (account: string) => [PREFIX, "getBalances", account],
  getUserShares: (account: string) => [PREFIX, "getUserShares", account],
  getWalletTokens: () => [PREFIX, "getWalletTokens"],
};
