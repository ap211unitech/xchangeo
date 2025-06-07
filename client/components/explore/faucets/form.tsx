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

const formSchema = z.object({
  token: z
    .string({
      required_error: "Please select a token",
    })
    .refine(val => isAddress(val), {
      message: "Invalid contract address",
    }),
  recipientAddress: z
    .string({
      required_error: "Please enter a wallet address",
    })
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

  return (
    <Card className="md:mx-auto md:max-w-3/4">
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
                      {testTokens.map(({ logo, name, contractAddress, ticker }) => (
                        <SelectItem key={contractAddress} value={contractAddress}>
                          <div className="relative h-6 w-6">
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
      <CardFooter>
        <span className="mr-1">Got your tokens?</span>
        <Button variant="link" className="px-0" asChild>
          <Link href="/swap">Start swapping.</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Sample Data
export const testTokens = [
  {
    name: "Dai Stablecoin",
    ticker: "DAI",
    contractAddress: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa", // Goerli
    logo: "https://img.freepik.com/premium-psd/dai-coin-logo-cryptocurrency-high-resolution-3d-render-transparant_513203-249.jpg",
  },
  {
    name: "USD Coin",
    ticker: "USDC",
    contractAddress: "0x07865c6e87b9f70255377e024ace6630c1eaa37f", // Goerli
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  },
  {
    name: "Wrapped Ether",
    ticker: "WETH",
    contractAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", // Goerli
    logo: "https://cryptologos.cc/logos/weth-weth-logo.png",
  },
  {
    name: "Tether USD",
    ticker: "USDT",
    contractAddress: "0x509Ee0d083DdF8AC028f2a56731412edD63223B9", // Goerli
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  {
    name: "Xchangeo Token",
    ticker: "XGO",
    contractAddress: "0x0000000000000000000000000000000000001234", // Replace with real
    logo: "/logos/xgo.png", // Local asset or hosted URL
  },
];
