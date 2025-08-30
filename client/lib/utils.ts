import { type ClassValue, clsx } from "clsx";
import { BrowserProvider, Eip1193Provider, ethers, Fragment, Interface, JsonFragment } from "ethers";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import { CONFIG } from "@/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

export const parseUnits = (val: number) => {
  return ethers.parseUnits(val.toString());
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

export const getSigner = async (walletProvider: Eip1193Provider) => {
  const provider = new BrowserProvider(walletProvider);
  const signer = await provider.getSigner();
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
    return revertData ?? "Transaction reverted: Unknown reason.";
  }
}
