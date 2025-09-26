import BigNumber from "bignumber.js";
import { type ClassValue, clsx } from "clsx";
import { BrowserProvider, Eip1193Provider, ethers, Fragment, Interface, JsonFragment } from "ethers";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import { CONFIG } from "@/config";
import { PoolInfo, TokenMetadata } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

export const parseUnits = (val: number) => {
  return ethers.parseUnits(
    new Intl.NumberFormat("en-US", {
      notation: "standard",
      useGrouping: false,
      minimumFractionDigits: 50,
      maximumFractionDigits: 50,
    }).format(val),
  );
};

export const formatUnits = (val: bigint) => {
  return Number(ethers.formatUnits(val));
};

export const trimString = (account?: string, chars: number = 8): string => {
  if (!account) return "";

  const keepChars = chars / 2;
  if (keepChars > account.length / 2) {
    return account;
  }
  return account.slice(0, keepChars) + "...." + account.slice(-keepChars);
};

export const formatBalance = (value: number | string): number => {
  const [intPart, decimalPart = ""] = value.toString().split(".");

  // Take only the first 4 digits after decimal
  const trimmedDecimal = decimalPart.slice(0, 4);

  // Remove trailing zeros
  const trimmedWithoutTrailingZeros = trimmedDecimal.replace(/0+$/, "");

  return trimmedWithoutTrailingZeros ? Number(`${intPart}.${trimmedWithoutTrailingZeros}`) : Number(intPart);
};

export const formatTimestamp = (date: string | number): string => {
  return moment(date).format("MMM D, YYYY, hh:mm:ss A");
};

export const getSigner = async (walletProvider: Eip1193Provider, address?: string) => {
  const provider = new BrowserProvider(walletProvider);
  const signer = await provider.getSigner(address);
  return signer;
};

export const executeGraphQLQuery = async <T>(
  key: string,
  query: string,
  next?: NextFetchRequestConfig | undefined,
  cache?: RequestCache | undefined,
): Promise<T> => {
  const res = await fetch(CONFIG.GRAPHQL_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    next,
    cache,
  });

  await sleep(0.5);

  if (!res.ok) throw new Error("GraphQL request failed!");

  return (await res.json()).data[key];
};

export function parseRevertError(error: Error, abi: ReadonlyArray<Fragment | JsonFragment>, customMessages?: Record<string, string>): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = error as any;
  const revertData = e?.cause?.error?.data ?? e?.cause?.data ?? e?.error?.data ?? e?.data ?? e?.message;

  try {
    const iface = new Interface(abi);

    if (!revertData) {
      return "Transaction reverted: Unknown reason.";
    }

    const parsedError = iface.parseError(revertData);

    if (!parsedError) {
      return `Transaction reverted`;
    }

    if (customMessages && parsedError.name in customMessages) {
      return customMessages[parsedError.name];
    }

    const reason = parsedError.args?.description || "Unknown reason";
    return `${parsedError.name}: ${reason}`;
  } catch {
    return revertData?.toString()?.includes("user rejected action") ? "User denied transaction signature" : "Transaction reverted: Unknown reason.";
  }
}

export const getAmountOnAddingLiquidity = (
  reserveA: BigNumber,
  reserveB: BigNumber,
  amountA: BigNumber,
  amountB: BigNumber,
  isTokenA: boolean,
): BigNumber => {
  if (reserveA.toNumber() > 0 || reserveB.toNumber() > 0) {
    if (isTokenA) {
      const expectedAmountB = amountA.multipliedBy(reserveB).div(reserveA);
      return expectedAmountB;
    } else {
      const expectedAmountA = amountB.multipliedBy(reserveA).div(reserveB);
      return expectedAmountA;
    }
  }

  return isTokenA ? amountB : amountA;
};

export const getAmountInForSwap = (pool: PoolInfo, tokenOut: string, amountOut: BigNumber): BigNumber => {
  if (!(tokenOut !== pool.tokenA.contractAddress || tokenOut !== pool.tokenB.contractAddress)) {
    return new BigNumber(0);
  }

  // Cannot calculate for a zero or negative output amount
  if (!amountOut || amountOut.isLessThanOrEqualTo(0)) {
    return new BigNumber(0);
  }

  const isToken1 = pool.tokenA.contractAddress === tokenOut;

  const resOut = new BigNumber(isToken1 ? pool.tokenA.reserve : pool.tokenB.reserve);
  const resIn = new BigNumber(!isToken1 ? pool.tokenA.reserve : pool.tokenB.reserve);

  if (resIn.isLessThanOrEqualTo(0) || resOut.isLessThanOrEqualTo(0)) {
    return new BigNumber(0);
  }

  // Not enough liquidity to fulfill the swap
  if (amountOut.isGreaterThanOrEqualTo(resOut)) {
    return new BigNumber(0);
  }

  // The formula would be: amountIn = (reserveIn * amountOut * 10000) / ((reserveOut - amountOut) * (10000 - feeTier))

  const numerator = resIn.multipliedBy(amountOut).multipliedBy(10000);

  const feeFactor = new BigNumber(10000 - pool.feeTier);
  const denominator = resOut.minus(amountOut).multipliedBy(feeFactor);

  // Should not happen due to the liquidity check above, but as a safeguard
  if (denominator.isLessThanOrEqualTo(0)) {
    return new BigNumber(0);
  }

  const amountIn = numerator.dividedBy(denominator);

  return amountIn;
};

export const getAmountOutOnSwap = (pool: PoolInfo, tokenIn: string, amountIn: BigNumber): BigNumber => {
  if (!(tokenIn !== pool.tokenA.contractAddress || tokenIn !== pool.tokenB.contractAddress)) {
    return new BigNumber(0);
  }

  if (amountIn.isLessThanOrEqualTo(new BigNumber(0))) {
    return new BigNumber(0);
  }

  const isToken1 = pool.tokenA.contractAddress === tokenIn;

  const resIn = isToken1 ? pool.tokenA.reserve : pool.tokenB.reserve;
  const resOut = !isToken1 ? pool.tokenA.reserve : pool.tokenB.reserve;

  if (resIn <= 0 || resOut <= 0) {
    return new BigNumber(0);
  }

  const amountInWithFee = amountIn.multipliedBy(new BigNumber(10000 - pool.feeTier)).dividedBy(10000);

  const amountOut = new BigNumber(resOut).multipliedBy(amountInWithFee).dividedBy(new BigNumber(resIn).plus(amountInWithFee));

  return amountOut;
};

export const getOtherTokensToSwap = (allLiquidityPools: PoolInfo[], choosenToken: string) => {
  const res = new Map<string, TokenMetadata>();
  allLiquidityPools.forEach(lp => {
    if (lp.tokenA.contractAddress === choosenToken) {
      res.set(lp.tokenB.contractAddress, lp.tokenB);
    }
    if (lp.tokenB.contractAddress === choosenToken) {
      res.set(lp.tokenA.contractAddress, lp.tokenA);
    }
  });
  return Array.from(res.values());
};

export const getHumanizeValue = (value?: number, maximumFractionDigits?: number) => {
  try {
    return new Intl.NumberFormat("en-US", {
      notation: "compact", // gives 1.2K, 1.5M etc.
      maximumFractionDigits: maximumFractionDigits ?? 4,
      roundingMode: "trunc",
    }).format(value ?? 0);
  } catch {
    return value;
  }
};

export const isLpToken = (token: TokenMetadata) => token.name.includes("LP") || token.ticker.includes("LP");
