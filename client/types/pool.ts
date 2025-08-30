import { TokenMetadata } from "./token";

export type PoolInfo = {
  poolAddress: string;
  tokenA: TokenMetadata & { reserve: number; allTimeVolume: number };
  tokenB: TokenMetadata & { reserve: number; allTimeVolume: number };
  lpToken: TokenMetadata;
  feeTier: number;
};
