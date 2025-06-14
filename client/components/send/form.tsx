"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAddress } from "ethers";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
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
  ImageComponent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import availableTokens from "@/public/tokens.json";

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

export const SendTokensForm = () => {
  const searchParams = useSearchParams();
  const preSelectedToken = searchParams.get("token") as string;

  const balance = 0.5;
  const isPending = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: availableTokens.some(({ contractAddress }) => contractAddress === preSelectedToken) ? preSelectedToken : "",
      recipientAddress: "",
      amount: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const selectedTokenInfo = availableTokens.find(({ contractAddress }) => form.watch("token") === contractAddress);

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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="relative w-full">
                        <SelectValue placeholder="Please select a token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTokens.map(({ logo, name, contractAddress, ticker }) => (
                        <SelectItem key={contractAddress} value={contractAddress}>
                          <div className="flex items-center justify-between gap-2">
                            <div className="relative h-6 w-6 overflow-hidden rounded-full">
                              <ImageComponent fill alt={name} src={logo} />
                            </div>
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
                    <Input placeholder="0.639" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="flex items-center gap-2">
              {isPending ? (
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
