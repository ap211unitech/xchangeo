"use client";

import clsx from "clsx";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui";

type Props = {
  onRefresh: () => Promise<void>;
};

export const RefreshRoute = ({ onRefresh }: Props) => {
  const [spinning, setSpinning] = useState(false);

  const onButtonClick = () => {
    setSpinning(true);

    // stop animation after 0.5s
    setTimeout(() => setSpinning(false), 500);
  };

  return (
    <form action={onRefresh}>
      <Button onClick={onButtonClick} type="submit" variant="outline">
        <RefreshCcw className={clsx(spinning && "animate-spin")} /> Refresh
      </Button>
    </form>
  );
};
