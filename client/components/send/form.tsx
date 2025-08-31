"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAddress } from "ethers";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
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
import { NATIVE_TOKEN } from "@/constants";
import { useBalances, useTransferTokens } from "@/hooks";
import { cn } from "@/lib/utils";
import { TokenMetadata } from "@/types";

import { Loading } from "./loading";

const formSchema = z.object({
  token: z
    .string()
    .nonempty("Please select a token")
    .refine(val => isAddress(val), {
      message: "Invalid contract address",
    }),
  recipientAddress: z
    .string()
    .nonempty("Please enter a wallet address")
    .refine(val => isAddress(val), {
      message: "Invalid Ethereum address",
    }),
  amount: z
    .string()
    .nonempty("Required")
    .refine(a => Number(a) > 0, "Amount must be more than 0")
    .refine(a => (a.split(".").at(1)?.length || 0) <= 18, "Max 18 digits allowed after decimal"),
});

type Props = { tokens: TokenMetadata[] };

export const SendTokensForm = ({ tokens }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: availableTokens = [], isPending: isBalancesPending } = useBalances(tokens);
  const { mutateAsync: onTransferTokens, isPending: isTransferPending } = useTransferTokens();

  // Make sure given token address exists in available tokens
  const preSelectedToken = tokens.find(token => token.contractAddress === searchParams.get("token"))
    ? searchParams.get("token")
    : NATIVE_TOKEN.contractAddress;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: preSelectedToken ?? NATIVE_TOKEN.contractAddress,
      recipientAddress: "",
      amount: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await onTransferTokens({ ...values, amount: +values.amount });
  };

  const onMax = () => {
    // Selected token is ETH
    if (selectedTokenInfo?.contractAddress === NATIVE_TOKEN.contractAddress) {
      const nativeTokenBalance = availableTokens.find(token => token.contractAddress === NATIVE_TOKEN.contractAddress)?.balance ?? 0;
      const gasBuffer = 0.01;
      const maxAmount = Math.max(0, nativeTokenBalance - gasBuffer);
      form.setValue("amount", String(maxAmount));
    } else {
      form.setValue("amount", String(availableTokens.find(token => token.contractAddress === selectedTokenInfo?.contractAddress)?.balance ?? 0));
    }
  };

  const selectedTokenInfo = useMemo(
    () => availableTokens.find(({ contractAddress }) => preSelectedToken === contractAddress),
    [availableTokens, preSelectedToken],
  );

  if (isBalancesPending) return <Loading />;

  return (
    <Card className="shadow-md md:mx-auto md:max-w-3/4">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select token</FormLabel>
                  <Select
                    onValueChange={e => {
                      field.onChange(e);
                      if (e === NATIVE_TOKEN.contractAddress) router.replace(`?`);
                      else router.replace(`?token=${e}`);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="relative w-full">
                        <SelectValue placeholder="Please select a token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTokens.map(({ name, contractAddress, ticker, balance }) => (
                        <SelectItem key={contractAddress} value={contractAddress}>
                          <div className="flex items-center justify-between gap-2">
                            <TokenLogo className="size-6" ticker={ticker} />
                            {name} ({ticker})
                          </div>
                          <div className={cn("text-muted-foreground absolute", selectedTokenInfo?.ticker === ticker ? "right-8" : "right-2")}>
                            {balance} {ticker}
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
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0xf24..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        placeholder="0.639"
                        {...field}
                        onChange={e => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                      <Button onClick={onMax} className="absolute right-2 h-6 rounded-sm px-2 text-xs" type="button">
                        MAX
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isTransferPending} className="flex items-center gap-2">
              {isTransferPending ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>Send</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
