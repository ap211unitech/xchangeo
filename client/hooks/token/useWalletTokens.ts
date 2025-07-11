"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { appService } from "@/services";

export const useWalletTokens = () =>
  useQuery({
    queryKey: QUERY_KEYS.getWalletTokens(),
    queryFn: () => appService.tokenService.getWalletTokens(),
  });
