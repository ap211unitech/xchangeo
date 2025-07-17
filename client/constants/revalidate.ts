"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { TAGS } from "./serverTags";

export const revalidateFaucetHistory = async (shouldRedirect = true) => {
  revalidateTag(TAGS.getFaucetTransactionsHistory());
  if (shouldRedirect) redirect("/explore/faucet-history");
};
