"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheckBig, CopyIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
      size: {
        lg: "py-1.5 px-4 text-sm font-semibold rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  size,
  copy = null,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean; copy?: React.ReactNode }) {
  const Comp = asChild ? Slot : "span";

  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = useCallback(() => {
    if (!copy) return;
    navigator.clipboard.writeText(copy.toString());
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 1500);
  }, [copy]);

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
      {!!copy && (
        <div className="z-50 ml-1">
          {hasCopied ? (
            <CircleCheckBig className="size-4 text-emerald-500" />
          ) : (
            <CopyIcon onClick={onCopy} className="text-muted-foreground size-4 cursor-pointer" />
          )}
        </div>
      )}
    </Comp>
  );
}

export { Badge, badgeVariants };
