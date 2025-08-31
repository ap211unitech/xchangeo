"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAddress } from "ethers";
import { Loader } from "lucide-react";
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
  ImageComponent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import liquidityPools from "@/public/liquidityPools.json";

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

export const AddLiquidityForm = () => {
  const isPending = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pool: liquidityPools[0].lpAddress,
      amountTokenA: "",
      amountTokenB: "",
    },
  });

  const selectedPoolInfo = liquidityPools.find(lp => lp.lpAddress === form.watch("pool")) as unknown as (typeof liquidityPools)[0];

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="relative w-full py-5 font-medium">
                        <SelectValue placeholder="Please select pool" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {liquidityPools.map(({ tokenA, tokenB, lpAddress }) => (
                        <SelectItem key={lpAddress} value={lpAddress} className="py-2">
                          <div className="flex w-fit items-center">
                            <div className="relative h-6 w-6 overflow-hidden rounded-full">
                              <ImageComponent fill alt={tokenA.name} src={tokenA.logo} />
                            </div>
                            <div className="relative -left-2 h-6 w-6 overflow-hidden rounded-full">
                              <ImageComponent fill alt={tokenB.name} src={tokenB.logo} />
                            </div>
                            <p className="flex items-center gap-1 tracking-wide">
                              {tokenA.symbol}/{tokenB.symbol}
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
                        <div className="flex items-center">
                          <div className="relative -left-2 size-6 overflow-hidden rounded-full">
                            <ImageComponent fill alt={selectedPoolInfo.tokenA.name} src={selectedPoolInfo.tokenA.logo} />
                          </div>
                          <p className="font-semibold">{selectedPoolInfo.tokenA.symbol}</p>
                        </div>
                        <div className="text-muted-foreground text-sm">0 {selectedPoolInfo.tokenA.symbol}</div>
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
                        <div className="flex items-center">
                          <div className="relative -left-2 size-6 overflow-hidden rounded-full">
                            <ImageComponent fill alt={selectedPoolInfo.tokenB.name} src={selectedPoolInfo.tokenB.logo} />
                          </div>
                          <p className="font-semibold">{selectedPoolInfo.tokenB.symbol}</p>
                        </div>
                        <div className="text-muted-foreground text-sm">0 {selectedPoolInfo.tokenB.symbol}</div>
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
