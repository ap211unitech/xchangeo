import { SettingsIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";

type Props = {
  maxSlippage: number;
  setMaxSlippage: Dispatch<SetStateAction<number>>;
};

export const MaxSlippage = ({ maxSlippage, setMaxSlippage }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="secondary" size="icon">
          <SettingsIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Max Slippage</p>
          <Input
            type="number"
            className="max-w-12"
            placeholder="0"
            value={maxSlippage}
            onChange={e => {
              const value = e.target.value;

              // Allow only valid float-like input
              if (/^\d*\.?\d*$/.test(value)) {
                const num = parseFloat(value);

                // If empty, let it through (so user can clear input)
                if (value === "") {
                  setMaxSlippage(+value);
                  return;
                }

                // Enforce 0 <= num <= 10
                if (!isNaN(num) && num >= 0 && num <= 10) {
                  setMaxSlippage(+value);
                }
              }
            }}
          />

          <span>%</span>
        </div>

        <div className="text-muted-foreground mt-4 text-xs italic">
          Your transaction will revert if the price changes more than the slippage percentage.
        </div>
      </PopoverContent>
    </Popover>
  );
};
