"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import BN from "bignumber.js";
import { isAddress } from "ethers";
import { ArrowUp, Loader, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TokenLogo,
} from "@/components/ui";
import { useBalances, useEstimatedSwapInfo, useSwap } from "@/hooks";
import { getAmountInForSwap, getAmountOutOnSwap, getOtherTokensToSwap } from "@/lib/utils";
import { PoolInfo, TokenMetadata } from "@/types";

import { Loading } from "./loading";
import { MaxSlippage } from "./maxSlippage";
import { SwapInfo } from "./swapInfo";

const formSchema = z.object({
  sellToken: z
    .string()
    .nonempty("Please select a token")
    .refine(val => isAddress(val), {
      message: "Invalid contract address",
    }),
  sellAmount: z
    .string()
    .nonempty("Required")
    .refine(a => Number(a) > 0, "Amount must be more than 0")
    .refine(a => (a.split(".").at(1)?.length || 0) <= 18, "Max 18 digits allowed after decimal"),
  buyToken: z
    .string()
    .nonempty("Please select a token")
    .refine(val => isAddress(val), {
      message: "Invalid contract address",
    }),
  buyAmount: z
    .string()
    .nonempty("Required")
    .refine(a => Number(a) > 0, "Amount must be more than 0")
    .refine(a => (a.split(".").at(1)?.length || 0) <= 18, "Max 18 digits allowed after decimal"),
});

type Props = {
  allLiquidityPools: PoolInfo[];
  tokens: TokenMetadata[];
  allowedTokensForSwap: TokenMetadata[];
};

export const SwapTokensForm = ({ tokens, allLiquidityPools, allowedTokensForSwap }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [maxSlippage, setMaxSlippage] = useState(5);
  const { data: availableTokens = [], isPending: isBalancesPending } = useBalances(tokens);
  const { mutateAsync: onSwap, isPending } = useSwap();

  const schema = formSchema.superRefine((data, ctx) => {
    if (Number(data.sellAmount) > sellTokenBalance) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sellAmount"], message: "Insufficient balance" });
    }
  });

  const querySellToken = searchParams.get("sellToken") as string;
  const queryBuyToken = searchParams.get("buyToken") as string;

  const isValidPoolFound = allLiquidityPools.find(
    ({ tokenA, tokenB }) =>
      (tokenA.contractAddress === querySellToken && tokenB.contractAddress === queryBuyToken) ||
      (tokenB.contractAddress === querySellToken && tokenA.contractAddress === queryBuyToken),
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      sellToken: isValidPoolFound ? querySellToken : allLiquidityPools[0].tokenA.contractAddress,
      buyToken: isValidPoolFound ? queryBuyToken : allLiquidityPools[0].tokenB.contractAddress,
      sellAmount: "",
      buyAmount: "",
    },
  });

  const sellTokenFormValue = form.watch("sellToken");
  const sellAmountFormValue = +(form.watch("sellAmount") || 0);
  const buyTokenFormValue = form.watch("buyToken");

  const selectedPoolInfo = allLiquidityPools.find(
    lp =>
      (lp.tokenA.contractAddress === sellTokenFormValue && lp.tokenB.contractAddress === buyTokenFormValue) ||
      (lp.tokenB.contractAddress === sellTokenFormValue && lp.tokenA.contractAddress === buyTokenFormValue),
  );
  const selectedSellToken = tokens.find(e => e.contractAddress === sellTokenFormValue);
  const selectedBuyToken = tokens.find(e => e.contractAddress === buyTokenFormValue);

  const [debouncedSellAmountFormValue] = useDebounceValue(sellAmountFormValue, 500);

  const { isLoading: isLoadingEstimatedFeeInfo, data: estimatedFeeInfo } = useEstimatedSwapInfo(
    selectedPoolInfo,
    sellTokenFormValue,
    debouncedSellAmountFormValue,
  );

  const isFetchingEstimatedFeeInfo = useMemo(
    () => isLoadingEstimatedFeeInfo && sellAmountFormValue > 0,
    [isLoadingEstimatedFeeInfo, sellAmountFormValue],
  );

  const [sellTokenBalance, buyTokenBalance] = useMemo(() => {
    return [
      availableTokens.find(token => token.contractAddress === sellTokenFormValue)?.balance ?? 0,
      availableTokens.find(token => token.contractAddress === buyTokenFormValue)?.balance ?? 0,
    ];
  }, [availableTokens, buyTokenFormValue, sellTokenFormValue]);

  const onChangeSellToken = (field: ControllerRenderProps<z.infer<typeof formSchema>>, selectedSellToken: string) => {
    const allowedTokensForBuy = getOtherTokensToSwap(allLiquidityPools, selectedSellToken);

    if (allowedTokensForBuy.length > 0) {
      const autoSelectedBuyToken =
        allowedTokensForBuy.find(e => e.contractAddress === buyTokenFormValue)?.contractAddress ?? allowedTokensForBuy[0].contractAddress;

      field.onChange(selectedSellToken);
      form.setValue("buyToken", autoSelectedBuyToken);
      router.replace(`?sellToken=${selectedSellToken}&buyToken=${autoSelectedBuyToken}`);
    }
  };

  const onChangeBuyToken = (field: ControllerRenderProps<z.infer<typeof formSchema>>, selectedBuyToken: string) => {
    const allowedTokensForSell = getOtherTokensToSwap(allLiquidityPools, selectedBuyToken);

    if (allowedTokensForSell.length > 0) {
      const autoSelectedSellToken =
        allowedTokensForSell.find(e => e.contractAddress === sellTokenFormValue)?.contractAddress ?? allowedTokensForSell[0].contractAddress;

      field.onChange(selectedBuyToken);
      form.setValue("sellToken", autoSelectedSellToken);
      router.replace(`?sellToken=${autoSelectedSellToken}&buyToken=${selectedBuyToken}`);
    }
  };

  const onChangeSellAmount = (field: ControllerRenderProps<z.infer<typeof formSchema>>, sellTokenValue: string) => {
    if (!selectedPoolInfo) return;

    field.onChange(sellTokenValue);

    const tokenBValue = getAmountOutOnSwap(selectedPoolInfo, sellTokenFormValue, new BN(sellTokenValue));

    form.setValue(
      "buyAmount",
      new Intl.NumberFormat("en-US", {
        notation: "standard",
        useGrouping: false,
        maximumFractionDigits: 8,
      }).format(tokenBValue.toNumber()),
    );
  };

  const onChangeBuyAmount = (field: ControllerRenderProps<z.infer<typeof formSchema>>, buyTokenValue: string) => {
    if (!selectedPoolInfo) return;

    field.onChange(buyTokenValue);

    const tokenAValue = getAmountInForSwap(selectedPoolInfo, buyTokenFormValue, new BN(buyTokenValue));

    form.setValue(
      "sellAmount",
      new Intl.NumberFormat("en-US", {
        notation: "standard",
        useGrouping: false,
        maximumFractionDigits: 8,
      }).format(tokenAValue.toNumber()),
    );
  };

  const onBuyMax = (field: ControllerRenderProps<z.infer<typeof formSchema>>) => onChangeBuyAmount(field, String(buyTokenBalance));
  const onSellMax = (field: ControllerRenderProps<z.infer<typeof formSchema>>) => onChangeSellAmount(field, String(sellTokenBalance));

  const onSubmit = async ({ sellToken, sellAmount }: z.infer<typeof formSchema>) => {
    await onSwap({
      pool: selectedPoolInfo,
      tokenIn: sellToken,
      amountIn: +sellAmount,
      maxSlippage,
    });
  };

  //  Handle reserve change after swap, fee estimate shows wrong some time or large input and very small inputs

  if (isBalancesPending) return <Loading />;

  return (
    <Card className="shadow-md md:mx-auto md:max-w-3/4">
      <CardHeader>
        <CardTitle>
          {!!selectedPoolInfo && (
            <div
              className="hover:text-primary flex w-fit cursor-pointer items-center"
              onClick={() => window.open(`https://sepolia.etherscan.io/address/${selectedPoolInfo.poolAddress}`)}
            >
              <div className="-mr-1 flex items-center">
                <TokenLogo ticker={selectedPoolInfo.tokenA.ticker} />
                <TokenLogo className="relative -left-3" ticker={selectedPoolInfo.tokenB.ticker} />
              </div>
              <p className="tracking-wide">
                {selectedPoolInfo.tokenA.ticker}/{selectedPoolInfo.tokenB.ticker}
              </p>
              <ArrowUp className="ml-1 size-4 rotate-45" />
            </div>
          )}
        </CardTitle>
        <CardAction className="flex items-center gap-2">
          <Button type="button" variant="secondary" asChild>
            <Link href={{ pathname: "/pools/addLiquidity", query: { pool: selectedPoolInfo?.poolAddress } }}>
              <Plus className="size-4" />
              Add Liquidity
            </Link>
          </Button>
          <MaxSlippage maxSlippage={maxSlippage} setMaxSlippage={setMaxSlippage} />
        </CardAction>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Sell token */}
            <FormField
              control={form.control}
              name="sellAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Sell</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        autoFocus
                        type="number"
                        className="h-28 text-2xl md:text-3xl"
                        placeholder="0"
                        {...field}
                        onChange={e => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            onChangeSellAmount(field, value);
                          }
                        }}
                      />
                      <div className="absolute right-4 flex flex-col items-end justify-end space-y-1.5">
                        <Button onClick={() => onSellMax(field)} className="float-right h-6 max-w-fit rounded-sm px-2 text-xs" type="button">
                          MAX
                        </Button>
                        <FormField
                          control={form.control}
                          name="sellToken"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={e => onChangeSellToken(field, e)} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="focus-visible:border-input relative w-full rounded-full pl-2 focus-visible:ring-0">
                                    <SelectValue placeholder="Select token" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {allowedTokensForSwap.map(({ contractAddress, ticker }) => (
                                    <SelectItem key={contractAddress} value={contractAddress}>
                                      <div className="flex items-center justify-between gap-2 font-medium">
                                        <TokenLogo className="size-6" ticker={ticker} />
                                        {ticker}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <div className="text-muted-foreground text-sm">
                          {sellTokenBalance} {selectedSellToken?.ticker}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buy token */}
            <FormField
              control={form.control}
              name="buyAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Buy</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        type="number"
                        className="h-28 text-2xl md:text-3xl"
                        placeholder="0"
                        {...field}
                        onChange={e => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            onChangeBuyAmount(field, value);
                          }
                        }}
                      />
                      <div className="absolute right-4 flex flex-col items-end justify-end space-y-1.5">
                        <Button onClick={() => onBuyMax(field)} className="float-right h-6 max-w-fit rounded-sm px-2 text-xs" type="button">
                          MAX
                        </Button>
                        <FormField
                          control={form.control}
                          name="buyToken"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={e => onChangeBuyToken(field, e)} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="relative. focus-visible:border-input w-full rounded-full pl-2 focus-visible:ring-0">
                                    <SelectValue placeholder="Select token" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {allowedTokensForSwap.map(({ contractAddress, ticker }) => (
                                    <SelectItem key={contractAddress} value={contractAddress}>
                                      <div className="flex items-center justify-between gap-2 font-medium">
                                        <TokenLogo className="size-6" ticker={ticker} />
                                        {ticker}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <div className="text-muted-foreground text-sm">
                          {buyTokenBalance} {selectedBuyToken?.ticker}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={isPending} className="flex items-center gap-2">
                {isPending ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  <>Swap</>
                )}
              </Button>

              <SwapInfo
                estimatedFeeInfo={estimatedFeeInfo}
                isFetchingEstimatedFeeInfo={isFetchingEstimatedFeeInfo}
                selectedBuyToken={selectedBuyToken}
                selectedSellToken={selectedSellToken}
                sellAmountFormValue={sellAmountFormValue}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
