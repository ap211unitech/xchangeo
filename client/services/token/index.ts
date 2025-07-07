import { AddressLike, Contract } from "ethers";

import { ABI, GET_ALL_TOKENS, TAGS } from "@/constants";
import { executeGraphQLQuery, formatUnits } from "@/lib/utils";

import { rpcProvider } from "..";
import { GetAllTokensResult, ITokenService } from "./types";

export class TokenService implements ITokenService {
  public async getAllTokens(): Promise<GetAllTokensResult[]> {
    const res = await executeGraphQLQuery<GetAllTokensResult[]>("erc20Tokens", GET_ALL_TOKENS, { tags: TAGS.getAllTokens });
    return res;
  }

  public async getBalance(token: string | null, account: AddressLike): Promise<number> {
    if (!token) {
      // Native token balance
      const balance = await rpcProvider.getBalance(account);
      return formatUnits(balance);
    }

    const erc20TokenContract = new Contract(token, ABI.ERC20TOKEN, rpcProvider);
    const balance = await erc20TokenContract.balanceOf(account);
    return formatUnits(balance);
  }
}
