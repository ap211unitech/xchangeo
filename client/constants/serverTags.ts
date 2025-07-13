const PREFIX = "@XchangeoService";

export const TAGS = {
  getAllTokens: [PREFIX, "getAllTokens"],
  getFaucetMetadata: (faucetAddress: string) => [PREFIX, "getFaucetMetadata", faucetAddress],
};
