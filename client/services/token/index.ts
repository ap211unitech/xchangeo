import { GET_ALL_TOKENS, TAGS } from "@/constants";
import { executeGraphQLQuery } from "@/lib/utils";

import { GetAllTokensResult, IToken } from "./types";

export class Token implements IToken {
  public async getAllTokens(): Promise<GetAllTokensResult[]> {
    const res = await executeGraphQLQuery<GetAllTokensResult[]>("erc20Tokens", GET_ALL_TOKENS, { tags: TAGS.getAllTokens });
    return res;
  }
}
