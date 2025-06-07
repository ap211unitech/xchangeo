"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAddress } from "ethers";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
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
});

export const FaucetForm = () => {
  const isPending = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
      recipientAddress: "",
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Please select a token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTokens.map(({ logo, name, contractAddress, ticker }) => (
                        <SelectItem key={contractAddress} value={contractAddress}>
                          <div className="relative h-6 w-6 overflow-hidden rounded-full">
                            <ImageComponent fill alt={name} src={logo} />
                          </div>
                          {name} ({ticker})
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
            <Button type="submit" disabled={isPending} className="flex items-center gap-2">
              {isPending ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>Get tokens</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="-mb-2 flex-col">
        <div className="flex w-full items-center justify-between border-b pb-4 text-xs">
          <div className="mr-4 flex items-center">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
            <span>Rate limit: 1 request per minute</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-2 w-2 rounded-full bg-blue-400"></div>
            <span>Amount: 5 {selectedTokenInfo?.ticker || "Units"}</span>
          </div>
        </div>
        <div className="pt-2">
          <span className="mr-1">Got your tokens?</span>
          <Button variant="link" className="px-0" asChild>
            <Link href="/swap">Start swapping.</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
