import { CONFIG } from "@/config";
import { TokenMetadata } from "@/services/types";

export * from "./abi";
export * from "./graphql";
export * from "./serverTags";

export const NATIVE_TOKEN: TokenMetadata = {
  name: CONFIG.IN_PRODUCTION ? "Ethereum" : "Hardhat Ether",
  ticker: CONFIG.IN_PRODUCTION ? "ETH" : "HETH",
  contractAddress: null,
};
