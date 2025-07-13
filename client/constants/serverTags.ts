const PREFIX = "@XchangeoService";

export const TAGS = {
  getAllTokens: [PREFIX, "getAllTokens"],
  getAllFaucetMetadata: () => [PREFIX, "getAllFaucetMetadata"],
  getFaucetMetadata: (tokenAddress: string) => [PREFIX, "getFaucetMetadata", tokenAddress],
};
