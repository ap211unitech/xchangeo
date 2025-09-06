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
import availableTokens from "@/public/tokens.json";

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

export const SwapTokensForm = () => {
  const searchParams = useSearchParams();
  const sellToken = searchParams.get("sellToken") as string;
  const buyToken = searchParams.get("buyToken") as string;

  const isPending = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sellToken: availableTokens.find(({ ticker }) => ticker === sellToken)?.contractAddress || "",
      buyToken: availableTokens.find(({ ticker }) => ticker === buyToken)?.contractAddress || "",
      sellAmount: "",
      buyAmount: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

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
                      <div className="absolute right-4 space-y-4">
                        <FormField
                          control={form.control}
                          name="sellToken"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="relative w-full rounded-4xl">
                                    <SelectValue placeholder="Select token" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableTokens.map(({ logo, name, contractAddress, ticker }) => (
                                    <SelectItem key={contractAddress} value={contractAddress}>
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="relative h-6 w-6 overflow-hidden rounded-full">
                                          <ImageComponent fill alt={name} src={logo} />
                                        </div>
                                        {ticker}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <Button className="float-right h-6 rounded-sm px-2 text-xs" type="button">
                          MAX
                        </Button>
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
                      <div className="absolute right-4 space-y-4">
                        <FormField
                          control={form.control}
                          name="buyToken"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="relative w-full rounded-4xl">
                                    <SelectValue placeholder="Select token" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableTokens.map(({ logo, name, contractAddress, ticker }) => (
                                    <SelectItem key={contractAddress} value={contractAddress}>
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="relative h-6 w-6 overflow-hidden rounded-full">
                                          <ImageComponent fill alt={name} src={logo} />
                                        </div>
                                        {ticker}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <Button className="float-right h-6 rounded-sm px-2 text-xs" type="button">
                          MAX
                        </Button>
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
