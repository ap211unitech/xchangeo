import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <>
      <Loader2 className="size-10 w-full animate-spin" />
      <span className="text-base">Loading...</span>
    </>
  );
};
