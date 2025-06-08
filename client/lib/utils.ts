import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
