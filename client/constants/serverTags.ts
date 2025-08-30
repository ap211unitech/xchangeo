const PREFIX = "@XchangeoService";

export const TAGS = {
  getAllTokens: [PREFIX, "getAllTokens"].join("--"),
  getAllFaucetMetadata: () => [PREFIX, "getAllFaucetMetadata"].join("--"),
  getFaucetMetadata: (tokenAddress: string) => [PREFIX, "getFaucetMetadata", tokenAddress].join("--"),
  getFaucetTransactionsHistory: () => [PREFIX, "getFaucetTransactionsHistory"].join("--"),
  getAllPools: () => [PREFIX, "getAllPools"].join("--"),
};
