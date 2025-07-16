import { AddressLike, Contract, Eip1193Provider, isAddress } from "ethers";

import { ABI, GET_ALL_TOKENS, LOCALSTORAGE, TAGS } from "@/constants";
import { executeGraphQLQuery, formatUnits } from "@/lib/utils";
import { TokenMetadata } from "@/types";

import { rpcProvider } from "..";
import { GetAllTokensResponse, ITokenService } from "./types";

export class TokenService implements ITokenService {
  public async getAllTokens(): Promise<TokenMetadata[]> {
    const res = await executeGraphQLQuery<GetAllTokensResponse[]>("erc20Tokens", GET_ALL_TOKENS, { tags: [TAGS.getAllTokens] });
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

  public getWalletTokens(): string[] {
    try {
      const raw = localStorage.getItem(LOCALSTORAGE.WALLET_TOKENS);
      if (!raw) return [];

      const parsed = JSON.parse(raw);

      // Check if parsed is an array of strings
      if (!Array.isArray(parsed) || !parsed.every(addr => typeof addr === "string" && isAddress(addr))) {
        localStorage.removeItem(LOCALSTORAGE.WALLET_TOKENS);
        return [];
      }

      return parsed;
    } catch {
      localStorage.removeItem(LOCALSTORAGE.WALLET_TOKENS);
      return [];
    }
  }

  public async addToWallet(wallet: Eip1193Provider, token: TokenMetadata): Promise<boolean> {
    const isAdded = await wallet.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: token.contractAddress,
          symbol: token.ticker,
          decimals: 18,
          image: this.changeToBase64(`token-${token.contractAddress}`),
        },
      },
    });

    const walletTokens = this.getWalletTokens();
    localStorage.setItem(LOCALSTORAGE.WALLET_TOKENS, JSON.stringify([...walletTokens, token.contractAddress]));

    return !!isAdded;
  }

  private changeToBase64(id: string) {
    const tokenSvgMarkup = document.getElementById(id)?.outerHTML;
    const utf8Bytes = new TextEncoder().encode(tokenSvgMarkup);
    const binary = Array.from(utf8Bytes, b => String.fromCharCode(b)).join("");
    const encoded = btoa(binary);
    return `data:image/svg+xml;base64,${encoded}`;
  }
}
