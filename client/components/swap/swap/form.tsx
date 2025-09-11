"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAddress } from "ethers";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Card,
  CardContent,
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
import { useBalances } from "@/hooks";
import { getOtherTokensToSwap } from "@/lib/utils";
import { PoolInfo, TokenMetadata } from "@/types";

import { Loading } from "./loading";

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
  const { data: availableTokens = [], isPending: isBalancesPending } = useBalances(tokens);

  const querySellToken = searchParams.get("sellToken") as string;
  const queryBuyToken = searchParams.get("buyToken") as string;

  const isValidPoolFound = allLiquidityPools.find(
    ({ tokenA, tokenB }) =>
      (tokenA.contractAddress === querySellToken && tokenB.contractAddress === queryBuyToken) ||
      (tokenB.contractAddress === querySellToken && tokenA.contractAddress === queryBuyToken),
  );

  const isPending = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sellToken: isValidPoolFound ? querySellToken : allLiquidityPools[0].tokenA.contractAddress,
      buyToken: isValidPoolFound ? queryBuyToken : allLiquidityPools[0].tokenB.contractAddress,
      sellAmount: "",
      buyAmount: "",
    },
  });

  const sellTokenFormValue = form.watch("sellToken");
  const buyTokenFormValue = form.watch("buyToken");

  const selectedPoolInfo = allLiquidityPools.find(
    lp =>
      (lp.tokenA.contractAddress === sellTokenFormValue && lp.tokenB.contractAddress === buyTokenFormValue) ||
      (lp.tokenB.contractAddress === sellTokenFormValue && lp.tokenA.contractAddress === buyTokenFormValue),
  );
  const selectedSellToken = tokens.find(e => e.contractAddress === sellTokenFormValue);
  const selectedBuyToken = tokens.find(e => e.contractAddress === buyTokenFormValue);

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

  const [sellTokenBalance, buyTokenBalance] = useMemo(() => {
    return [
      availableTokens.find(token => token.contractAddress === sellTokenFormValue)?.balance ?? 0,
      availableTokens.find(token => token.contractAddress === buyTokenFormValue)?.balance ?? 0,
    ];
  }, [availableTokens, buyTokenFormValue, sellTokenFormValue]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  if (isBalancesPending) return <Loading />;

  return (
    <Card className="shadow-md md:mx-auto md:max-w-3/4">
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
                        type="number"
                        className="h-28 text-2xl md:text-3xl"
                        placeholder="0"
                        {...field}
                        onChange={e => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                      <div className="absolute right-4 flex flex-col items-end justify-end space-y-1.5">
                        <Button className="float-right h-6 max-w-fit rounded-sm px-2 text-xs" type="button">
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
                            field.onChange(value);
                          }
                        }}
                      />
                      <div className="absolute right-4 flex flex-col items-end justify-end space-y-1.5">
                        <Button className="float-right h-6 max-w-fit rounded-sm px-2 text-xs" type="button">
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
