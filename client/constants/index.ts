import { ZeroAddress } from "ethers";

import { CONFIG } from "@/config";
import { TokenMetadata } from "@/types";

export * from "./abi";
export * from "./graphql";
export * from "./revalidate";
export * from "./serverTags";

export const PREFIX = "@Xchangeo";

export const NATIVE_TOKEN: TokenMetadata = {
  name: CONFIG.IN_PRODUCTION ? "Ethereum" : "Hardhat Ether",
  ticker: CONFIG.IN_PRODUCTION ? "ETH" : "HETH",
  contractAddress: ZeroAddress,
};

export const LOCALSTORAGE = {
  WALLET_TOKENS: `${PREFIX}:walletTokens`,
};
