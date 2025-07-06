import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import { CONFIG } from "@/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

export const trimString = (account?: string, chars: number = 8): string => {
  if (!account) return "";

  const keepChars = chars / 2;
  if (keepChars > account.length / 2) {
    return account;
  }
  return account.slice(0, keepChars) + "...." + account.slice(-keepChars);
};

export const formatTimestamp = (date: string): string => {
  return moment.utc(date).format("MMM D, YYYY, hh:mm:ss A");
};

export const executeGraphQLQuery = async <T>(key: string, query: string, next?: NextFetchRequestConfig | undefined): Promise<T> => {
  const res = await fetch(CONFIG.GRAPHQL_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    next,
  });

  await sleep(0.5);

  if (!res.ok) throw new Error("GraphQL request failed!");

  return (await res.json()).data[key];
};
