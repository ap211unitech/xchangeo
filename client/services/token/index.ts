import { AddressLike, Contract } from "ethers";

import { ABI, GET_ALL_TOKENS, TAGS } from "@/constants";
import { executeGraphQLQuery, formatUnits } from "@/lib/utils";

import { rpcProvider } from "..";
import { TokenMetadata } from "../types";
import { GetAllTokensResponse, ITokenService } from "./types";

export class TokenService implements ITokenService {
  public async getAllTokens(): Promise<TokenMetadata[]> {
    const res = await executeGraphQLQuery<GetAllTokensResponse[]>("erc20Tokens", GET_ALL_TOKENS, { tags: TAGS.getAllTokens });
    return res.map(({ tokenAddress, name, symbol }) => ({
      name: name,
      ticker: symbol,
      contractAddress: tokenAddress,
    }));
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
