"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAddress } from "ethers";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
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
import liquidityPools from "@/public/liquidityPools.json";

const formSchema = z.object({
  pool: z
    .string()
    .nonempty("Please select a pool")
    .refine(val => isAddress(val), {
      message: "Invalid contract address",
    }),
  share: z
    .string()
    .nonempty("Required")
    .refine(a => Number(a) > 0, "Amount must be more than 0")
    .refine(a => (a.split(".").at(1)?.length || 0) <= 18, "Max 18 digits allowed after decimal"),
});

export const RemoveLiquidityForm = () => {
  const isPending = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pool: "",
      share: "",
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
            <FormField
              control={form.control}
              name="share"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground absolute pt-3 pl-4 text-base">Withdrawal amount</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        className="h-44 rounded-3xl pb-6 text-center text-2xl font-semibold md:text-3xl"
                        placeholder="10%"
                        {...field}
                        value={field.value !== "" ? `${field.value}%` : ""}
                        onChange={e => {
                          const input = e.target;
                          const raw = e.target.value.replace("%", "").trim();

                          // Allow only whole numbers (no decimals)
                          if (!/^\d*$/.test(raw)) {
                            // Lock cursor before %
                            requestAnimationFrame(() => {
                              const position = input.value.length - 1; // before '%'
                              input.setSelectionRange(position, position);
                            });

                            return;
                          }

                          const parsed = parseFloat(raw);
                          if (!(parsed > 100)) field.onChange(raw);

                          // Lock cursor before %
                          requestAnimationFrame(() => {
                            const position = input.value.length - 1; // before '%'
                            input.setSelectionRange(position, position);
                          });
                        }}
                        onClick={e => {
                          const input = e.currentTarget;
                          const pos = input.value.length - 1;
                          input.setSelectionRange(pos, pos);
                        }}
                        onFocus={e => {
                          const input = e.currentTarget;
                          const pos = input.value.length - 1;
                          input.setSelectionRange(pos, pos);
                        }}
                      />
                      <div className="absolute bottom-4 left-0 flex w-full items-center justify-center gap-3">
                        {[25, 50, 75, 100].map(val => {
                          return (
                            <Button
                              key={uuidv4()}
                              size="sm"
                              type="button"
                              onClick={() => form.setValue("share", val.toString())}
                              variant="outline"
                              className="bg-muted hover:bg-muted/70 dark:bg-background/50 dark:hover:bg-background/30 rounded-full px-4 first:hidden first:[@media(min-width:400px)]:inline-flex"
                            >
                              {val === 100 ? "MAX" : `${val}%`}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Pool</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="relative w-full">
                        <SelectValue placeholder="Please select pool" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {liquidityPools.map(({ tokenA, tokenB, lpAddress }) => (
                        <SelectItem key={lpAddress} value={lpAddress}>
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
            <Button type="submit" disabled={isPending} className="flex items-center gap-2">
              {isPending ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Removing liquidity...
                </>
              ) : (
                <>Remove liquidity</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
