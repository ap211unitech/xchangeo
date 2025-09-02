"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAddress } from "ethers";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

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
import { useAddLiquidity, useBalances } from "@/hooks";
import { PoolInfo, TokenMetadata } from "@/types";

import { Loading } from "./loading";

const formSchema = z.object({
  pool: z
    .string()
    .nonempty("Please select a pool")
    .refine(val => isAddress(val), {
      message: "Invalid contract address",
    }),
  amountTokenA: z
    .string()
    .nonempty("Required")
    .refine(a => Number(a) > 0, "Amount must be more than 0")
    .refine(a => (a.split(".").at(1)?.length || 0) <= 18, "Max 18 digits allowed after decimal"),
  amountTokenB: z
    .string()
    .nonempty("Required")
    .refine(a => Number(a) > 0, "Amount must be more than 0")
    .refine(a => (a.split(".").at(1)?.length || 0) <= 18, "Max 18 digits allowed after decimal"),
});

type Props = {
  allLiquidityPools: PoolInfo[];
  tokens: TokenMetadata[];
};

export const AddLiquidityForm = ({ tokens, allLiquidityPools }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: availableTokens = [], isPending: isBalancesPending } = useBalances(tokens);
  const { mutateAsync: onAddLiquidity, isPending } = useAddLiquidity();

  // Make sure given pool address exists in available pools
  const preSelectedPool = allLiquidityPools.find(lp => lp.poolAddress === searchParams.get("pool"))
    ? searchParams.get("pool")
    : allLiquidityPools.at(0)?.poolAddress;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pool: preSelectedPool ?? "",
      amountTokenA: "",
      amountTokenB: "",
    },
  });

  const selectedPoolInfo = allLiquidityPools.find(lp => lp.poolAddress === form.watch("pool")) as PoolInfo;

  const [balanceTokenA, balanceTokenB] = useMemo(() => {
    return [
      availableTokens.find(token => token.contractAddress === selectedPoolInfo.tokenA.contractAddress)?.balance ?? 0,
      availableTokens.find(token => token.contractAddress === selectedPoolInfo.tokenB.contractAddress)?.balance ?? 0,
    ];
  }, [availableTokens, selectedPoolInfo.tokenA.contractAddress, selectedPoolInfo.tokenB.contractAddress]);

  const onSubmit = async ({ amountTokenA, amountTokenB, pool }: z.infer<typeof formSchema>) => {
    await onAddLiquidity({
      poolAddress: pool,
      tokenA: selectedPoolInfo.tokenA.contractAddress,
      tokenB: selectedPoolInfo.tokenB.contractAddress,
      amountTokenA: +amountTokenA,
      amountTokenB: +amountTokenB,
    });
  };

  if (isBalancesPending) return <Loading />;

  return (
    <Card className="shadow-md md:mx-auto md:max-w-3/4">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="pool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Choose Pool</FormLabel>
                  <Select
                    onValueChange={e => {
                      field.onChange(e);
                      router.replace(`?pool=${e}`);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="relative w-full py-6 font-medium">
                        <SelectValue placeholder="Please select pool" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allLiquidityPools.map(({ tokenA, tokenB, poolAddress }) => (
                        <SelectItem key={poolAddress} value={poolAddress} className="py-2 font-medium">
                          <div className="flex w-fit items-center">
                            <TokenLogo ticker={tokenA.ticker} />
                            <TokenLogo className="relative -left-2" ticker={tokenB.ticker} />
                            <p className="flex items-center gap-1 tracking-wide">
                              {tokenA.ticker}/{tokenB.ticker}
                            </p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amountTokenA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Deposit tokens</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input className="h-20 text-2xl font-semibold md:text-3xl" placeholder="0" {...field} />
                      <div className="absolute right-4 flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <TokenLogo ticker={selectedPoolInfo.tokenA.ticker} />
                          <p className="font-semibold">{selectedPoolInfo.tokenA.ticker}</p>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {balanceTokenA} {selectedPoolInfo.tokenA.ticker}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amountTokenB"
              render={({ field }) => (
                <FormItem className="-mt-4">
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input className="h-20 text-2xl font-semibold md:text-3xl" placeholder="0" {...field} />
                      <div className="absolute right-4 flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <TokenLogo ticker={selectedPoolInfo.tokenB.ticker} />
                          <p className="font-semibold">{selectedPoolInfo.tokenB.ticker}</p>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {balanceTokenB} {selectedPoolInfo.tokenB.ticker}
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
                  Adding liquidity...
                </>
              ) : (
                <>Add liquidity</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
