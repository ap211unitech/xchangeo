const PREFIX = "@XchangeoService";

export const QUERY_KEY = {
  getBalances: (account: string) => [PREFIX, account],
};
