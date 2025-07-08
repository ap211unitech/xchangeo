import { TokenMetadata } from "@/services/types";

export type Token = TokenMetadata & {
  balance: number;
};
