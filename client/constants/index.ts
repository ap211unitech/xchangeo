import { CONFIG } from "@/config";
import { TokenMetadata } from "@/types";

export * from "./abi";
export * from "./graphql";
export * from "./serverTags";
export * from "./utils";

export const PREFIX = "@Xchangeo";

export const NATIVE_TOKEN: TokenMetadata = {
  name: CONFIG.IN_PRODUCTION ? "Ethereum" : "Hardhat Ether",
  ticker: CONFIG.IN_PRODUCTION ? "ETH" : "HETH",
  contractAddress: null,
};

export const LOCALSTORAGE = {
  WALLET_TOKENS: `${PREFIX}:walletTokens`,
};
